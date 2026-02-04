import * as React from "react"
import Svg, { ForeignObject, G, Path, Defs, ClipPath } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: div, filter */

function EyeOffSVG({width = 96, height = 112}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 96 112"
      fill="none"
    >
      <ForeignObject
        x={-0.00156403}
        y={-3.1001}
        width={111.8}
        height={114.9}
      ></ForeignObject>
      <G filter="url(#filter0_d_574_23276)" data-figma-bg-blur-radius={24}>
        <Path
          d="M39.898 36.9c0-3.72 0-5.58.41-7.106a12 12 0 018.485-8.485c1.526-.41 3.386-.41 7.105-.41 3.72 0 5.58 0 7.106.41a12 12 0 018.486 8.485c.408 1.526.408 3.386.408 7.106 0 3.72 0 5.58-.408 7.106a12 12 0 01-8.486 8.485c-1.526.409-3.386.409-7.106.409-3.72 0-5.58 0-7.105-.409a12 12 0 01-8.486-8.485c-.409-1.526-.409-3.386-.409-7.106z"
          fill="#fff"
          fillOpacity={0.19}
        />
        <G opacity={0.6}>
          <Path
            opacity={0.12}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M55.898 44.9c7 0 10-5.5 10-8s-3-8-10-8-10 5.5-10 8 3 8 10 8zm0-5a3 3 0 100-6 3 3 0 000 6z"
            fill="#fff"
          />
          <Path
            d="M65.898 36.9c0 2.5-3 8-10 8s-10-5.5-10-8 3-8 10-8 10 5.5 10 8z"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M58.898 36.9a3 3 0 11-6 0 3 3 0 016 0z"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </G>
      </G>
      <Defs>
        <ClipPath
          id="bgblur_0_574_23276_clip_path"
        >
          <Path d="M39.898 36.9c0-3.72 0-5.58.41-7.106a12 12 0 018.485-8.485c1.526-.41 3.386-.41 7.105-.41 3.72 0 5.58 0 7.106.41a12 12 0 018.486 8.485c.408 1.526.408 3.386.408 7.106 0 3.72 0 5.58-.408 7.106a12 12 0 01-8.486 8.485c-1.526.409-3.386.409-7.106.409-3.72 0-5.58 0-7.105-.409a12 12 0 01-8.486-8.485c-.409-1.526-.409-3.386-.409-7.106z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default EyeOffSVG
