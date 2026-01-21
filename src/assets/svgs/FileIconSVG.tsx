import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FileIconSVG(props: any) {
  return (
    <Svg
      width={17}
      height={20}
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.917 1.208V3.05c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874c.428.218.988.218 2.108.218h1.841M5.333 14.5h.917l1.375-2.75L9 14.5h1.833m4.584-5.926v3.176c0 2.173 0 3.26-.332 4.125a5 5 0 01-2.877 2.876c-.865.332-1.951.332-4.125.332-2.173 0-3.26 0-4.125-.332a5 5 0 01-2.876-2.876C.75 15.01.75 13.923.75 11.75V7.88c0-1.983 0-2.974.277-3.772a5 5 0 013.081-3.08C4.906.75 5.898.75 7.88.75c.868 0 1.301 0 1.715.07a5 5 0 012.065.855c.341.243.648.55 1.262 1.163l.203.204c.814.814 1.22 1.22 1.518 1.691.305.483.525 1.014.651 1.571.123.544.123 1.12.123 2.27z"
        stroke={props.color || "#0069B1"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FileIconSVG;

