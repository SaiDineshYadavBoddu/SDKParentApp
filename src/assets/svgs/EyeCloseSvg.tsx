import * as React from "react"
import Svg, { Path } from "react-native-svg"

function EyeCloseSvg() {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
    >
      <Path
        d="M2.75 2.75l2.59 2.59m13.91 13.91l-2.59-2.59m0 0c-1.416.984-3.287 1.673-5.66 1.673-6.417 0-9.166-5.041-9.166-7.333 0-1.444 1.092-3.981 3.506-5.66m11.32 11.32l-3.715-3.716M5.34 5.34l3.716 3.715m0 0a2.75 2.75 0 103.89 3.89m-3.89-3.89l3.889 3.89m5.773 1.722c.113-.152.22-.305.319-.459.768-1.183 1.13-2.377 1.13-3.208 0-2.292-2.75-7.333-9.167-7.333-1.005 0-1.92.123-2.75.341a9.64 9.64 0 00-.458.133"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default EyeCloseSvg
