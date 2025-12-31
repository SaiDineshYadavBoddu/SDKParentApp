import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ResetPinSVG(props: any) {
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
                d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12m20 0c0-5.523-4.477-10-10-10m10 10h-2M2 12C2 6.477 6.477 2 12 2M2 12h2m8-10v2m7 1l-1 1m1 13l-1-1M5 19l1-1M5 5l1 1m6 3s-2 1.482-2 3.556c0 3.259 4 3.259 4 0C14 10.482 12 9 12 9z"
                stroke="#0069B1"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default ResetPinSVG
