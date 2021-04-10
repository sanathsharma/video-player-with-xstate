import intervalToDuration from "date-fns/intervalToDuration";
import mapValues from "lodash/mapValues";

export const getEvents = send => {
    return {
        onCanPlay: event => send({ type: "READY", elVideo: event.target }),
        onError: _ => send("FAILED"),
        onPlay: _ => send("PLAY"),
        onPause: _ => send("PAUSE"),
        onTimeUpdate: event => send({ type: event.type, currentTime: event.target.currentTime }), // called by video element
        onEnded: _ => send("END"),
        onToggleMute: _ => send("TOGGLE_MUTE"),
        onToggleFullscreen: _ => send("TOGGLE_FULLSCREEN"),
        onSliderChange: currentTime => send({ type: "CURRENT_TIME_CHANGE", currentTime }),
        onForward: _ => send({ type: "FORWARD", incrementBy: 10 }),
        onRewind: _ => send({ type: "REWIND", decrementBy: 10 }),
        forwardEventToMachine: event => send(event), // on container
        onMouseMove: event => {
            event.stopPropagation();
            send("mousemove:child");
        }
    };
};

const toDoubleDigit = (number) => {
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
};

export const formatDuration = (duration_sec) => {
    const duration = intervalToDuration({ start: 0, end: duration_sec * 1000 });
    const { hours, minutes, seconds } = mapValues(duration, toDoubleDigit);
    return `${hours}:${minutes}:${seconds}`;
};