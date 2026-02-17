import * as React from "react"
import Svg, { Path } from "react-native-svg"

function EyeOpenSVG() {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
    >
      <Path
        d="M20.167 11c0 2.291-2.75 7.333-9.167 7.333S1.834 13.292 1.834 11 4.584 3.667 11 3.667c6.417 0 9.167 5.041 9.167 7.333z"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M13.75 11a2.75 2.75 0 11-5.5 0 2.75 2.75 0 015.5 0z"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default EyeOpenSVG
