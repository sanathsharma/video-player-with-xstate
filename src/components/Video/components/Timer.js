import styled from "styled-components";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";

const Div = styled.div`
    font-size: 0.7rem;
    display: flex;

    & .timer__icon-btn {
        font-size: 0.9em;
        padding: 0.0625rem;
    }
`;

const Timer = ({ elapsed, duration }) => (
    <Div>
        <span>{elapsed}</span>
        <IconButton
            className="timer__icon-btn"
            flip="horizontal"
            icon={faSlash}
            transform={{ rotate: 25 }}
        />
        <span>{duration}</span>
    </Div>
);

export default Timer;