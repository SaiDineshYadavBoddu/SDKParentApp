import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CheckmarkSVG(props: any) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M4 13l5 5L20 6"
                stroke="#070707"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default CheckmarkSVG
