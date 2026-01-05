import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function InfoSVG(props: any) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.999 10.667V7.333m.333-2a.333.333 0 11-.667 0m.667 0a.333.333 0 00-.667 0m.667 0h-.667m7 2.667A6.667 6.667 0 111.332 8a6.667 6.667 0 0113.333 0z"
        stroke="#0069B1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.999 10.667V7.333m.333-2a.333.333 0 11-.667 0m.667 0a.333.333 0 00-.667 0m.667 0h-.667m7 2.667A6.667 6.667 0 111.332 8a6.667 6.667 0 0113.333 0z"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default InfoSVG;
