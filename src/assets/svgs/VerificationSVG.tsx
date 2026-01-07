import * as React from "react"
import Svg, { Path } from "react-native-svg"

function VerificationSVG(props: any) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M34 20L38 24L46 16M26 12C26 16.4183 22.4183 20 18 20C13.5817 20 10 16.4183 10 12C10 7.58172 13.5817 4 18 4C22.4183 4 26 7.58172 26 12ZM10.4 44H25.6C29.1346 44 32 41.1346 32 37.6C32 32.2981 27.7019 28 22.4 28H13.6C8.29807 28 4 32.2981 4 37.6C4 41.1346 6.86538 44 10.4 44Z"
        stroke="#0069B1"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default VerificationSVG
