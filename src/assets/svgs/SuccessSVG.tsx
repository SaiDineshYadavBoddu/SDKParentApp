import * as React from 'react';
import Svg, { Path, Circle, G, Defs, ClipPath, Rect } from 'react-native-svg';

function SuccessSVG(props: any) {
  return (
    <Svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <G clipPath="url(#clip0_788_12370)">
        <Circle cx="40" cy="40" r="40" fill="#00AF4A"/>
        <Path d="M26 42L36 52L58 28" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </G>
        <Defs>
        <ClipPath id="clip0_788_12370">
        <Rect width="80" height="80" fill="white"/>
        </ClipPath>
        </Defs>
    </Svg>
  );
}

export default SuccessSVG;
