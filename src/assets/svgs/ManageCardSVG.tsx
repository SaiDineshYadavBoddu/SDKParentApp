import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ManageCardSVG(props: any) {
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
        d="M5.107 18.864c-1.133-.68-1.7-1.02-2.11-1.487a4.001 4.001 0 01-.807-1.425C2 15.358 2 14.698 2 13.376v-2.752c0-1.322 0-1.982.19-2.576a4 4 0 01.806-1.425c.412-.468.978-.808 2.111-1.487l3.6-2.16c1.197-.719 1.796-1.078 2.435-1.218a4 4 0 011.716 0c.639.14 1.238.5 2.435 1.218l3.6 2.16c1.133.68 1.7 1.02 2.11 1.487a4 4 0 01.807 1.425c.19.594.19 1.254.19 2.576v2.752c0 1.322 0 1.982-.19 2.576a4 4 0 01-.806 1.425c-.412.468-.978.808-2.111 1.487l-3.6 2.16c-1.197.719-1.796 1.078-2.435 1.218a3.998 3.998 0 01-1.716 0c-.639-.14-1.238-.5-2.435-1.218l-3.6-2.16z"
        stroke={props.color || '#0069B1'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12a3 3 0 116 0 3 3 0 01-6 0z"
        stroke={props.color || '#0069B1'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ManageCardSVG;
