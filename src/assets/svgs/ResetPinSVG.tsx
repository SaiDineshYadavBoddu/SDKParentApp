import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ResetPinSVG(props: any) {
    return (
        <Svg
            width={20}
            height={22}
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M4.75 6.75v-1.2c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C7.03.75 7.87.75 9.55.75h3.2a2 2 0 012 2v.5m-5 9.5v2m-2.6 6h5.2c2.24 0 3.36 0 4.216-.436a4 4 0 001.748-1.748c.436-.856.436-1.976.436-4.216v-1.2c0-2.24 0-3.36-.436-4.216a4 4 0 00-1.748-1.748c-.856-.436-1.976-.436-4.216-.436h-5.2c-2.24 0-3.36 0-4.216.436a4 4 0 00-1.748 1.748C.75 9.79.75 10.91.75 13.15v1.2c0 2.24 0 3.36.436 4.216a4 4 0 001.748 1.748c.856.436 1.976.436 4.216.436z"
                stroke="#0069B1"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
        </Svg>
    )
}

export default ResetPinSVG
