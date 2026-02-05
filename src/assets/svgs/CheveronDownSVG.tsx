import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ChevronDownSVG({ width = 24, height = 24, stroke = '#4A4A4A' }: { width?: number, height?: number, stroke?: string }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      stroke={stroke}
    >
      <Path
        d="M5.5 8.25L11 13.75L16.5 8.25"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChevronDownSVG;