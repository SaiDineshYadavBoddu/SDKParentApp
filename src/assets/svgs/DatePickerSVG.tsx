import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

function DatePickerSVG(props: any) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clip-path="url(#clip0_574_7024)">
                <Path
                    d="M5.33331 0.666626V2.66663M10.6666 0.666626V2.66663M11.3333 5.33329H4.66665M7.73331 14.6666H8.26665C10.5069 14.6666 11.627 14.6666 12.4826 14.2307C13.2353 13.8472 13.8472 13.2352 14.2307 12.4826C14.6666 11.6269 14.6666 10.5068 14.6666 8.26663V7.73329C14.6666 5.49308 14.6666 4.37298 14.2307 3.51733C13.8472 2.76468 13.2353 2.15276 12.4826 1.76927C11.627 1.33329 10.5069 1.33329 8.26665 1.33329H7.73331C5.4931 1.33329 4.373 1.33329 3.51735 1.76927C2.7647 2.15276 2.15278 2.76468 1.76929 3.51733C1.33331 4.37298 1.33331 5.49308 1.33331 7.73329V8.26663C1.33331 10.5068 1.33331 11.6269 1.76929 12.4826C2.15278 13.2352 2.7647 13.8472 3.51735 14.2307C4.373 14.6666 5.4931 14.6666 7.73331 14.6666Z"
                    stroke="#4A4A4A"
                    strokeLinecap="round"
                    strokeLinejoin='round'
                />
            </G>
            <Defs>
                <ClipPath id="clip0_574_7024">
                    <Rect width="16" height="16" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default DatePickerSVG;
