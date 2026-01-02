import * as React from "react"
import Svg, { Path } from "react-native-svg"

function WarningSVG(props: any) {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M10 1.041A8.959 8.959 0 1110 18.96 8.959 8.959 0 0110 1.041zm0 7.59a.536.536 0 00-.536.536v4.166a.537.537 0 001.072 0V9.167A.536.536 0 0010 8.631zm0-2.917c-.493 0-.899.375-.948.856l-.005.097.005.097a.954.954 0 101.045-1.045l-.096-.005z"
                fill="#AC8504"
            />
        </Svg>
    )
}

export default WarningSVG
