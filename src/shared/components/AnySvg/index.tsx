import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { mvs } from "react-native-size-matters";
import * as Svgs from "@assets/svgs";

interface Props {
  name: keyof typeof Svgs;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
  size?: number | string;
}

const AnySvg: React.FC<Props> = ({
  name,
  width = 27,
  height = 27,
  style = {},
  fill,
  size,
  ...props
}) => {
  const Tag = (Svgs as { [key: string]: React.FC<any> })[name];
  if (!Tag) return null;

  const computedWidth = size || (typeof width === "string" ? width : mvs(width));
  const computedHeight = size || (typeof height === "string" ? height : mvs(height));

  return (
    <Tag {...props} width={computedWidth} height={computedHeight} style={style} color={fill} />
  );
};

export default AnySvg;
