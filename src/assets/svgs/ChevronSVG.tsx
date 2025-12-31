import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ChevronSVG(props: any) {
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
                opacity={0.9}
                d="M10 6l6 6-6 6"
                stroke="#0069B1"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default ChevronSVG
