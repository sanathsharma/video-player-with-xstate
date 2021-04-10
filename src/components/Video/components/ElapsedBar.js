import "rc-slider/assets/index.css";
import { Slider } from "components/Video/styled";

const ElapsedBar = ({ duration, elapsed, disabled, onSliderChange }) => {
    return (
        <Slider
            onChange={onSliderChange}
            min={0}
            value={elapsed}
            max={duration}
            isDisabled={disabled}
        />
    );
};

export default ElapsedBar;