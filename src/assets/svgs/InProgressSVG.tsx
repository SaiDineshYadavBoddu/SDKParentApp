import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function InProgressSVG(props: any) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M11.3333 4.66664L12.9094 3.09054M3.0908 12.9092L4.66677 11.3332M4.6669 4.66664L3.0908 3.09054M12.9094 12.9092L11.3334 11.3332M12.4377 8.00004H14.6666M1.33331 8.00004H3.56208M7.99998 3.56232V1.33337M7.99998 14.6667V12.4379"
                stroke="#2E84BF"
                strokeLinecap="round"
                strokeLinejoin='round'
            />
        </Svg>
    );
}

export default InProgressSVG;
