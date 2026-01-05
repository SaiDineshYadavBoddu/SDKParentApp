import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function FreezeCardSVG(props: any) {
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
        d="M17.5 9l.5-3.5M3 7l3.5 2L3 7zm18 10l-3.5-2 3.5 2zm-9-5L6.5 9l5.5 3zm0 0l-5.5 3 5.5-3zm0 0V5v7zm0 0v6.5V12zm0 0l5.5 3-5.5-3zm0 0l5.5-3-5.5 3zm0-10v3-3zm0 20v-3.5V22zm9-15l-3.5 2L21 7zM3 17l3.5-2L3 17zm3.5-8L3 10l3.5-1zm0 0L6 5.5 6.5 9zm0 6L3 14l3.5 1zm0 0L6 18.5l.5-3.5zM12 5L9.5 4 12 5zm0 0l2.5-1L12 5zm0 13.5l2.5 1.5-2.5-1.5zm0 0L9.5 20l2.5-1.5zm5.5-3.5l.5 3.5-.5-3.5zm0 0l3.5-1-3.5 1zm0-6l3.5 1-3.5-1z"
        stroke="#0069B1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FreezeCardSVG;
