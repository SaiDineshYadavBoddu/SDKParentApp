import * as React from "react"
import Svg, { Path } from "react-native-svg"

function FreezeCardSVG(props: any) {
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
        d="M7 8V6.8c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C9.28 2 10.12 2 11.8 2h.4c1.68 0 2.52 0 3.162.327a3 3 0 011.311 1.311C17 4.28 17 5.12 17 6.8V8m-5 6v2m-2.6 6h5.2c2.24 0 3.36 0 4.216-.436a4 4 0 001.748-1.748C21 18.96 21 17.84 21 15.6v-1.2c0-2.24 0-3.36-.436-4.216a4 4 0 00-1.748-1.748C17.96 8 16.84 8 14.6 8H9.4c-2.24 0-3.36 0-4.216.436a4 4 0 00-1.748 1.748C3 11.04 3 12.16 3 14.4v1.2c0 2.24 0 3.36.436 4.216a4 4 0 001.748 1.748C6.04 22 7.16 22 9.4 22z"
        stroke="#070707"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default FreezeCardSVG
