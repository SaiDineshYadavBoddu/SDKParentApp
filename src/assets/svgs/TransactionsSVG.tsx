import * as React from "react"
import Svg, { Path } from "react-native-svg"

function TransactionsSVG(props: any) {
    return (
        <Svg
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M5.5 1.833L1.833 5.5m0 0L5.5 9.167M1.833 5.5h12.834m1.833 7.333l3.667 3.667m0 0L16.5 20.167m3.667-3.667H7.333"
                stroke={props.color || "#4A4A4A"}
                strokeWidth={1.375}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default TransactionsSVG
