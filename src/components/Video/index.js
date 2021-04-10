import { useMemo } from "react";
import { useMachine } from "@xstate/react";
import { faPlay, faPause, faRedo, faExpand, faVolumeMute, faVolumeUp, faCompress } from "@fortawesome/free-solid-svg-icons";
import ElapsedBar from "./components/ElapsedBar";
import IconButton from "./components/IconButton";
import Timer from "./components/Timer";
import videoMachine from "./video.machine";
import * as S from "./styled";
import { formatDuration, getEvents } from "./utils";
import AdditionalControls from "./components/AdditionalControls";

const VideoPlayer = ({
    src,
    type,
    height,
    width,
    title = ""
}) => {
    const [current, send] = useMachine(videoMachine);
    const { duration, currentTime } = current.context;

    const {
        onCanPlay,
        onEnded,
        onError,
        onPlay,
        onPause,
        onTimeUpdate,
        onToggleMute,
        onToggleFullscreen,
        onSliderChange,
        onForward,
        onRewind,
        onMouseMove,
        forwardEventToMachine
    } = useMemo(() => getEvents(send), [send]);

    return (
        <S.Container
            width={width}
            height={height}
            background={current.matches("ready") ? "#000" : undefined}
            onMouseMove={forwardEventToMachine}
            onMouseLeave={forwardEventToMachine}
            data-inactive={current.matches("ready.hideControls")}
        >
            {title && <S.Header onMouseMove={onMouseMove}>{title}</S.Header>}
            {current.matches("failure") && <S.Message>Could not load the video</S.Message>}
            {current.matches("ready") && <AdditionalControls onMouseMove={onMouseMove} onForward={onForward} onRewind={onRewind} />}

            <video
                onCanPlay={onCanPlay}
                onError={onError}
                onTimeUpdate={onTimeUpdate}
                onEnded={onEnded}
            >
                <source src={src} type={type} />
            </video>

            <S.ControlsContainer onMouseMove={onMouseMove}>
                {current.matches("ready.showControls.play.paused") && <IconButton icon={faPlay} onClick={onPlay} />}
                {current.matches("ready.showControls.play.ended") && <IconButton icon={faRedo} onClick={onPlay} />}
                {current.matches("ready.showControls.play.playing") && <IconButton icon={faPause} onClick={onPause} />}
                {current.matches("ready.showControls.mute.muteOn") && <IconButton icon={faVolumeMute} onClick={onToggleMute} />}
                {current.matches("ready.showControls.mute.muteOff") && <IconButton icon={faVolumeUp} onClick={onToggleMute} />}
                {current.matches("ready.showControls.fullscreen.fullscreenOn") && <IconButton icon={faCompress} onClick={onToggleFullscreen} />}
                {current.matches("ready.showControls.fullscreen.fullscreenOff") && <IconButton icon={faExpand} onClick={onToggleFullscreen} />}
                <ElapsedBar
                    duration={duration}
                    elapsed={currentTime}
                    onSliderChange={onSliderChange}
                    disabled={!current.matches("ready")}
                />
                <Timer duration={formatDuration(duration)} elapsed={formatDuration(currentTime)} />
            </S.ControlsContainer>
        </S.Container>
    );
};

export default VideoPlayer;