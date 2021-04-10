import { createMachine, assign, send } from "xstate";

const DEFAULT_JUMP_SEC = 10;
const HIDE_CONTROLS_TIMEOUT = 4000;

const controlsMachine = {
    id: "controlsMachine",
    type: "parallel",
    states: {
        play: {
            initial: "paused",
            states: {
                paused: {
                    on: {
                        PLAY: {
                            target: "playing",
                            actions: ["playVideo"]
                        }
                    }
                },
                playing: {
                    on: {
                        PAUSE: {
                            target: "paused",
                            actions: ["pauseVideo"]
                        },
                        END: "ended",
                        timeupdate: {
                            actions: ["updateCurrentTime"]
                        }
                    }
                },
                ended: {
                    on: {
                        PLAY: {
                            target: "playing",
                            actions: ["resetCurrentTime", "playVideo"]
                        }
                    }
                }
            }
        },
        mute: {
            initial: "muteOff",
            states: {
                muteOff: {
                    on: {
                        TOGGLE_MUTE: {
                            target: "muteOn",
                            actions: ["toggleMute"]
                        }
                    }
                },
                muteOn: {
                    on: {
                        TOGGLE_MUTE: {
                            target: "muteOff",
                            actions: ["toggleMute"]
                        }
                    }
                }
            }
        },
        fullscreen: {
            initial: "fullscreenOff",
            states: {
                fullscreenOff: {
                    on: {
                        TOGGLE_FULLSCREEN: {
                            target: "fullscreenOn",
                            actions: ["enterFullscreen"]
                        }
                    }
                },
                fullscreenOn: {
                    on: {
                        TOGGLE_FULLSCREEN: {
                            target: "fullscreenOff",
                            actions: ["exitFullScreen"]
                        }
                    }
                }
            }
        },
        hist: {
            type: "history",
            history: "deep"
        }
    }
};

const videoMachine = createMachine({
    id: "video",
    initial: "loading",
    context: {
        elVideo: null,
        duration: 0,
        currentTime: 0,
        retries: 0,
        timeoutId: null,
    },
    states: {
        loading: {
            on: {
                READY: {
                    target: "ready",
                    actions: ["assignVideoRef"],
                },
                FAILED: "failure"
            }
        },
        ready: {
            initial: "showControls",
            on: {
                CURRENT_TIME_CHANGE: {
                    actions: ["updateVideoCurrentTime"]
                },
                FORWARD: {
                    actions: ["incrementVideoCurrentTime"]
                },
                REWIND: {
                    actions: ["decrementVideoCurrentTime"]
                },
                mousemove: {
                    actions: ["forwardEventToTimeoutSvc"]
                },
                "mousemove:child": {
                    actions: ["forwardEventToTimeoutSvc"]
                },
                mouseleave: {
                    actions: ["forwardEventToTimeoutSvc"]
                }
            },
            invoke: {
                id: "timeoutSvc",
                src: "setupTimeout"
            },
            states: {
                showControls: {
                    on: {
                        HIDE_CONTROLS: "hideControls"
                    },
                    ...controlsMachine
                },
                hideControls: {
                    on: {
                        SHOW_CONTROLS: "showControls.hist"
                    }
                },
            }
        },
        failure: {
            type: "final"
        }
    }
}, {
    actions: {
        updateCurrentTime: assign({
            currentTime: (_, event) => event.currentTime
        }),
        updateVideoCurrentTime: assign({
            currentTime: (context, event) => {
                context.elVideo.currentTime = event.currentTime;
                return event.currentTime;
            }
        }),
        incrementVideoCurrentTime: assign({
            currentTime: (context, event) => {
                context.elVideo.currentTime += event.incrementBy || DEFAULT_JUMP_SEC;
                return context.elVideo.currentTime;
            }
        }),
        decrementVideoCurrentTime: assign({
            currentTime: (context, event) => {
                context.elVideo.currentTime -= event.decrementBy || DEFAULT_JUMP_SEC;
                return context.elVideo.currentTime;
            }
        }),
        resetCurrentTime: assign({
            currentTime: 0
        }),
        assignVideoRef: assign({
            elVideo: (_, event) => event.elVideo,
            duration: (_, event) => event.elVideo.duration,
        }),
        playVideo: context => context.elVideo.play(),
        pauseVideo: context => context.elVideo.pause(),
        toggleMute: context => context.elVideo.muted = !context.elVideo.muted,
        enterFullscreen: context => context.elVideo.parentElement.requestFullscreen(),
        exitFullScreen: _ => document.exitFullscreen(),
        forwardEventToTimeoutSvc: send((_, event) => event, { to: "timeoutSvc" })
    },
    services: {
        setupTimeout: _ => (callback, onReceive) => {
            let timeoutId = null;

            onReceive(event => {
                switch (event.type) {
                    case "mousemove":
                        clearTimeout(timeoutId);

                        timeoutId = setTimeout(() => {
                            callback("HIDE_CONTROLS");
                        }, HIDE_CONTROLS_TIMEOUT);

                        callback("SHOW_CONTROLS");
                        return;

                    case "mousemove:child":
                        clearTimeout(timeoutId);
                        callback("SHOW_CONTROLS");
                        return;

                    case "mouseleave":
                        clearTimeout(timeoutId);
                        callback("HIDE_CONTROLS");
                        return;

                    default: return;
                }
            });

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }
});

export default videoMachine;