import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ReplaceCardSVG(props: any) {
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
                d="M3 20h13.2c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C21 17.72 21 16.88 21 15.2V14M3 20l3-3m-3 3l3 3M21 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 6.28 3 7.12 3 8.8V10m18-6l-3-3m3 3l-3 3"
                stroke={props.color || "#0069B1"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default ReplaceCardSVG
