import styled, { css } from "styled-components";
import RCSlider from "rc-slider";

const MixenBg = css`
    background: rgba(0, 0, 0, 0.57);
    color: #fff;
    font-weight: 400;
`;

const MixenContainer = css`
    position: absolute;
    left: 0;

    width: 100%;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: -1;
`;

export const Header = styled.div`
    top: 0;
    font-size: 0.8rem;
    padding: 0.625rem 1rem;

    ${MixenContainer}
    ${MixenBg}
`;

export const ControlsContainer = styled.div`
    display: flex;
    padding: 0.625rem;
    bottom: 0;

    ${MixenContainer}
    ${MixenBg}
`;

export const AdditionalControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;

    padding: 0.625rem 1rem;
    width: 70%;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: -1;

    & .additional__icon-btn {
        ${MixenBg}

        font-size: 1.6rem;
        padding: 0.3rem 0.7rem;
        border-radius: 2px;
    }
`;

export const Container = styled.div`
    position: relative;
    overflow: hidden;
    user-select: none;
    background: ${({ background = "#f0f0f0" }) => background};

    ${({ height = "14.0625rem", width = "25rem" }) => css`
        display: flex;
        justify-content: center;
        align-items: center;

        height: ${height};
        width: ${width};

        & video {
            max-height: 100%;
            max-width: 100%;
        }
    `}}

    &:hover ${AdditionalControlsContainer},
    &:hover ${ControlsContainer},
    &:hover ${Header} {
        opacity: 1;
        pointer-events: all;
        z-index: 2;
    }

    &[data-inactive="true"]:hover ${AdditionalControlsContainer},
    &[data-inactive="true"]:hover ${ControlsContainer},
    &[data-inactive="true"]:hover ${Header} {
        opacity: 0;
        pointer-events: none;
        z-index: -1;
    }

    &[data-inactive="true"] {
        cursor: none !important;
    }
`;

export const Message = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 0.8rem;

    padding: 0.625rem 1rem;
    border-radius: 2px;

    ${MixenBg}
`;

export const Slider = styled(RCSlider)`
    margin: 0 0.625rem;

    & .rc-slider-handle {
        height: 0.7rem;
        width: 0.7rem;
        margin-top: -0.2rem;
    }

    ${({ isDisabled = false }) => isDisabled && css`
        opacity: 0.8;
        pointer-events: none;
    `}
`;