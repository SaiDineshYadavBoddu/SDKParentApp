import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function BlockCardSVG(props: any) {
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
        d="M2.006 8H8m13.006 0H12M2 2l1.716 1.716M22 22l-1.716-1.716m0 0a4.005 4.005 0 01-.468.28C18.96 21 17.84 21 15.6 21H8.4c-2.24 0-3.36 0-4.216-.436a4 4 0 01-1.748-1.748C2 17.96 2 16.84 2 14.6V9.4c0-2.24 0-3.36.436-4.216a4 4 0 011.28-1.468m16.568 16.568L8 8M3.716 3.716L8 8M7 3.006C7.413 3 7.876 3 8.4 3h7.2c2.24 0 3.36 0 4.216.436a4 4 0 011.748 1.748C22 6.04 22 7.16 22 9.4v5.2c0 .997 0 1.771-.038 2.4-.011.178-.025.344-.043.5M6 12h2"
        stroke="#0069B1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BlockCardSVG;
