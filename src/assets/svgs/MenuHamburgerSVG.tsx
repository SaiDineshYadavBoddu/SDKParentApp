import * as React from "react"
import Svg, { Path } from "react-native-svg"

function MenuHamburgerSVG(props: any) {
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
                d="M3 20.0002L21 20.0002M11 12.0002L21 12.0002M3 4.00024L21 4.00024"
                stroke="#070707"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default MenuHamburgerSVG
