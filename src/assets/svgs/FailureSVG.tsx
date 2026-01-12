import * as React from 'react';
import Svg, { Path, Circle, G, Defs, ClipPath, Rect } from 'react-native-svg';

function FailureSVG(props: any) {
  return (
    <Svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <G clipPath="url(#clip0_788_12387)">
        <Circle cx="40" cy="40" r="40" fill="#E65474"/>
        <Path d="M39.75 43.5V22.5M41.5 55.75C41.5 56.7165 40.7165 57.5 39.75 57.5C38.7835 57.5 38 56.7165 38 55.75M41.5 55.75C41.5 54.7835 40.7165 54 39.75 54C38.7835 54 38 54.7835 38 55.75M41.5 55.75H38" stroke="white" strokeWidth={3.85} strokeLinecap="round" strokeLinejoin="round"/>
        </G>
        <Defs>
        <ClipPath id="clip0_788_12387">
        <Rect width="80" height="80" fill="white"/>
        </ClipPath>
        </Defs>
    </Svg>
  );
}

export default FailureSVG;
