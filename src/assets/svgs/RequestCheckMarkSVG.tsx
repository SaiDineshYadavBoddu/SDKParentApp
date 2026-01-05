import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RequestCheckMarkSVG(props: any) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M2.66669 8.66667L6.00002 12L13.3334 4"
                stroke="#4A4A4A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default RequestCheckMarkSVG
