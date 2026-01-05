import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function MyProfileSVG(props: any) {
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
        d="M3.667 17.233a4.4 4.4 0 014.4-4.4h5.866a4.4 4.4 0 014.4 4.4 2.933 2.933 0 01-2.933 2.934H6.6a2.933 2.933 0 01-2.933-2.934zM14.667 5.5a3.667 3.667 0 11-7.334 0 3.667 3.667 0 017.334 0z"
        stroke={props.color || "#4A4A4A"}
        strokeWidth={1.375}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default MyProfileSVG;
