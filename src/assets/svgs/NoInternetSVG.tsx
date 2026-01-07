import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { ms } from 'react-native-size-matters';

interface NoInternetSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

const NoInternetSVG: React.FC<NoInternetSVGProps> = ({
  width = ms(100),
  height = ms(100),
  color = '#00529B', // Default blue color from design
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
        <Path
            d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M10 50H90"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M50 10C61.0457 22.0914 67.5 35.5914 67.5 50C67.5 64.4086 61.0457 77.9086 50 90C38.9543 77.9086 32.5 64.4086 32.5 50C32.5 35.5914 38.9543 22.0914 50 10Z"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* X Mark Circle */}
        <Circle cx="75" cy="75" r="15" fill="white" stroke={color} strokeWidth="4" />
        <Path
            d="M70 80L80 70"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M80 80L70 70"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
  );
};

export default NoInternetSVG;
