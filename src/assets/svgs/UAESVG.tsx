import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';

function UAESVG(props: any) {
  return (
    <Svg
      width={24}
      height={18}
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width="24" height="18" fill="#ffffff" />
      <Rect width="6" height="18" fill="#ce1126" />
      <Rect x="6" width="18" height="6" fill="#00732f" />
      <Rect x="6" y="6" width="18" height="6" fill="#ffffff" />
      <Rect x="6" y="12" width="18" height="6" fill="#000000" />
    </Svg>
  );
}

export default UAESVG;
