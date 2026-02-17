import * as React from 'react';
import { ms } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';

function NotificationSVG(props: any) {
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
        d="M8 19.546C8.659 21.027 10.378 22 12 22c1.622 0 3.341-.973 4-2.454m2-8.356V8A6 6 0 006 8v3.19c0 .834-.354 1.629-.974 2.186l-1.107.997c-1.323 1.19-.901 3.36.771 3.969l.211.077a20.773 20.773 0 0014.198 0l.21-.077c1.673-.608 2.095-2.778.772-3.969l-1.107-.997A2.941 2.941 0 0118 11.19z"
        stroke={props.color || props.stroke || "#070707"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default NotificationSVG;
