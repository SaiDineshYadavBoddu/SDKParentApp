import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CheckmarkSVG({width=24, height=24, fill= 'none', stroke="#070707"} : {width?: number, height?: number, fill?: string, stroke?: string}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fill}
        >
            <Path
                d="M4 13l5 5L20 6"
                stroke={stroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default CheckmarkSVG
