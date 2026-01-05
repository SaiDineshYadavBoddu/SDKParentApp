import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

function ResolvedSVG(props: any) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clipPath="url(#clip0_574_7045)">
                <Path
                    d="M5.66665 8.33337L7.33331 10L11 6.33337M14.6666 8.00004C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8.00004C1.33331 4.31814 4.31808 1.33337 7.99998 1.33337C11.6819 1.33337 14.6666 4.31814 14.6666 8.00004Z"
                    stroke="#2FBF71"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin='round'
                />
            </G>
            <Defs>
                <ClipPath id="clip0_574_7045">
                    <Rect width="16" height="16" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default ResolvedSVG;
