import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CardUsageSVG(props: any) {
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
                d="M8 16v-6m4 6V8m4 8v-4m-6 10h4c2.8 0 4.2 0 5.27-.545a5 5 0 002.185-2.185C22 18.2 22 16.8 22 14v-4c0-2.8 0-4.2-.545-5.27a5 5 0 00-2.185-2.185C18.2 2 16.8 2 14 2h-4c-2.8 0-4.2 0-5.27.545A5 5 0 002.545 4.73C2 5.8 2 7.2 2 10v4c0 2.8 0 4.2.545 5.27a5 5 0 002.185 2.185C5.8 22 7.2 22 10 22z"
                stroke="#0069B1"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default CardUsageSVG
