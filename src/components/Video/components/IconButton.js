import styled from "styled-components";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

/**
 * @param {FontAwesomeIconProps} props 
 */
const WrappedIcon = (props) => {
    const { className, onClick, ...rest } = props;

    return (
        <button className={className} onClick={onClick}>
            <FontAwesomeIcon {...rest} />
        </button>
    );
};

const IconButton = styled(WrappedIcon)`
    border: none;
    background: transparent;
    outline: none;
    cursor: pointer;
    color: inherit;
    padding: 0.0625rem 0.375rem;
`;

export default IconButton;