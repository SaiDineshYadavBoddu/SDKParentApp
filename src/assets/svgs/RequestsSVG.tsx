import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RequestsSVG(props: any) {
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
        d="M8.25 10.083v1.834m0-6.417v1.833m0 7.334V16.5m-6.417-2.444v2.837A2.357 2.357 0 004.19 19.25h13.62a2.357 2.357 0 002.357-2.357v-2.837a.306.306 0 00-.306-.306 2.444 2.444 0 01-2.444-2.444v-.612A2.445 2.445 0 0119.86 8.25a.306.306 0 00.306-.306V5.107a2.357 2.357 0 00-2.358-2.357H4.19a2.357 2.357 0 00-2.357 2.357v2.837c0 .17.137.306.306.306a2.444 2.444 0 012.444 2.444v.612A2.444 2.444 0 012.14 13.75a.306.306 0 00-.306.306z"
        stroke={props.color || "#4A4A4A"}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default RequestsSVG
