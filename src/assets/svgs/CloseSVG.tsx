import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CloseSVG(props: any) {
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
                d="M18 6L6 18M6 6l12 12"
                stroke="#000000"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default CloseSVG
