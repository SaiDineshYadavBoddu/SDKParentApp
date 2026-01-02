import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BackButtonSVG(props: any) {
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
        d="M10 5l-7 7m0 0l7 7m-7-7h18"
        stroke="#0069B1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default BackButtonSVG
