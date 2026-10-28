import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function BnplSVG(props: any) {
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
        d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5v-9z"
        stroke={props.color || '#0069B1'}
        strokeWidth={1.5}
      />
      <Path
        d="M4 10h16M8 14.5h3"
        stroke={props.color || '#0069B1'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default BnplSVG;
