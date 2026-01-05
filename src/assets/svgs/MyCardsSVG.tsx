import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function MyCardsSVG(props: any) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2.292 7.333h17.416M5.5 11h3.667M7.7 19.25h6.6c2.053 0 3.08 0 3.865-.4a3.667 3.667 0 001.602-1.602c.4-.784.4-1.811.4-3.865V8.617c0-2.054 0-3.08-.4-3.865a3.667 3.667 0 00-1.602-1.602c-.785-.4-1.811-.4-3.865-.4H7.7c-2.054 0-3.08 0-3.865.4-.69.351-1.25.912-1.602 1.602-.4.784-.4 1.811-.4 3.865v4.766c0 2.054 0 3.08.4 3.865.351.69.912 1.25 1.602 1.602.785.4 1.811.4 3.865.4z"
        stroke={props.color || '#0069B1'}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MyCardsSVG;
