import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DownloadSVG() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M14 2.5v2.3c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C15.52 8 16.08 8 17.2 8h2.3M12 11v6m0 0l2.5-2.5M12 17l-2.5-2.5M20 10.314V14c0 2.8 0 4.2-.545 5.27a5 5 0 01-2.185 2.185C16.2 22 14.8 22 12 22c-2.8 0-4.2 0-5.27-.545a5 5 0 01-2.185-2.185C4 18.2 4 16.8 4 14V9.778c0-2.591 0-3.887.469-4.891a5 5 0 012.418-2.418C7.89 2 9.187 2 11.778 2c1.133 0 1.699 0 2.233.119a5 5 0 011.604.664c.462.294.862.695 1.663 1.495l.379.379c.865.865 1.297 1.297 1.606 1.802.274.447.476.935.599 1.445.138.575.138 1.187.138 2.41z"
        stroke="#F5F9FC"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default DownloadSVG
