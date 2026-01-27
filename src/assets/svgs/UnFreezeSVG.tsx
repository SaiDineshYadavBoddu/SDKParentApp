import * as React from "react"
import Svg, { Path } from "react-native-svg"

function UnFreezeSVG(props: any) {
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
                d="M17 7l2.364-2.364M4.636 19.364L7 17M7 7L4.636 4.636m14.728 14.728L17 17m1.657-5H22M2 12h3.343M12 5.343V2m0 20v-3.343"
                stroke="#070707"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default UnFreezeSVG
