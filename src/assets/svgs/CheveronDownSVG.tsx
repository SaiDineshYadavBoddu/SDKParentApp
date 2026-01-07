import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ChevronDownSVG(props: any) {
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
        d="M5.5 8.25L11 13.75L16.5 8.25"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ChevronDownSVG;