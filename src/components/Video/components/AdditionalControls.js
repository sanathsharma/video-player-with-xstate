import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import { AdditionalControlsContainer } from "../styled";

const AdditionalControls = ({ onForward, onRewind, onMouseMove }) => {
    return (
        <AdditionalControlsContainer>
            <IconButton
                className="additional__icon-btn"
                onMouseMove={onMouseMove}
                icon={faAngleDoubleLeft}
                onClick={onRewind}
            />
            <IconButton
                className="additional__icon-btn"
                onMouseMove={onMouseMove}
                icon={faAngleDoubleRight}
                onClick={onForward}
            />
        </AdditionalControlsContainer>
    );
};

export default AdditionalControls;