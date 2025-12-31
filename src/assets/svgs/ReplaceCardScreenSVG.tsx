import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ReplaceCardScreenSVG(props: any) {
    return (
        <Svg
            width={43}
            height={43}
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M9.5 1.5l-8 8m0 0l8 8m-8-8h28m4 16l8 8m0 0l-8 8m8-8h-28"
                stroke="#0069B1"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default ReplaceCardScreenSVG
