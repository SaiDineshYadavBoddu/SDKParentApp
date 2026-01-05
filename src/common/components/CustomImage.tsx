import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

interface Props {
  source: ImageSourcePropType;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  style?: StyleProp<ImageStyle>;
}

export default function CustomImage({
  source,
  resizeMode = 'cover',
  style,
}: Props) {
  return <Image source={source} style={style} resizeMode={resizeMode} />;
}
