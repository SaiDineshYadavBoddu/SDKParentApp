import * as React from "react"
import Svg, { Path } from "react-native-svg"

function StatementDownloadSVG(props: any) {
    return (
        <Svg
            width={48}
            height={48}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M0 8a8 8 0 018-8h32a8 8 0 018 8v32a8 8 0 01-8 8H8a8 8 0 01-8-8V8z"
                fill="#E6F0F7"
            />
            <Path
                d="M26 14.5v2.3c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C27.52 20 28.08 20 29.2 20h2.3M24 23v6m0 0l2.5-2.5M24 29l-2.5-2.5M32 22.314V26c0 2.8 0 4.2-.545 5.27a5 5 0 01-2.185 2.185C28.2 34 26.8 34 24 34c-2.8 0-4.2 0-5.27-.545a5 5 0 01-2.185-2.185C16 30.2 16 28.8 16 26v-4.222c0-2.591 0-3.887.469-4.891a5 5 0 012.418-2.418C19.89 14 21.187 14 23.778 14c1.133 0 1.699 0 2.233.119.57.126 1.113.35 1.604.664.462.294.863.694 1.663 1.495l.379.379c.865.865 1.297 1.297 1.606 1.802.274.447.476.935.599 1.445.138.575.138 1.187.138 2.41z"
                stroke="#0069B1"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default StatementDownloadSVG
