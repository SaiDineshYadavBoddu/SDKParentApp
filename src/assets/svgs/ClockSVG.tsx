import * as React from "react"
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg"

function ClockSVG(props: any) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clip-path="url(#clip0_574_7014)">
                <Path
                    d="M8.00002 5.33329V7.99996L10 9.33329M2.66669 0.666626L0.666687 2.66663M13.3334 0.666626L15.3334 2.66663M14.6667 7.99996C14.6667 11.6819 11.6819 14.6666 8.00002 14.6666C4.31812 14.6666 1.33335 11.6819 1.33335 7.99996C1.33335 4.31806 4.31812 1.33329 8.00002 1.33329C11.6819 1.33329 14.6667 4.31806 14.6667 7.99996Z"
                    stroke="#4A4A4A"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_574_7014">
                    <Rect width="16" height="16" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default ClockSVG
