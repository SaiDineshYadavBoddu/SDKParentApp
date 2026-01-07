import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function CalendarSVG(props: any) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Rect
                x={3}
                y={4}
                width={18}
                height={18}
                rx={2}
                stroke="currentColor"
                strokeWidth={2}
            />
            <Path
                d="M16 2v4M8 2v4M3 10h18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default CalendarSVG;
