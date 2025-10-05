import React, {ReactNode} from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {fontFamily as fm, fontSize as fs} from '@theme/fonts';
import {colors} from '@theme/colors';

interface Props extends TextProps {
  children: ReactNode | undefined | any;
  color?: string;
  bold?: boolean;
  regular?: boolean;
  medium?: boolean;
  semiBold?: boolean;
  light?: boolean;
  extraBold?: boolean;
  extraLight?: boolean;
  black?: boolean;
  FONT_48?: boolean;
  FONT_44?: boolean;
  FONT_40?: boolean;
  FONT_38?: boolean;
  FONT_36?: boolean;
  FONT_34?: boolean;
  FONT_32?: boolean;
  FONT_30?: boolean;
  FONT_28?: boolean;
  FONT_26?: boolean;
  FONT_24?: boolean;
  FONT_22?: boolean;
  FONT_20?: boolean;
  FONT_18?: boolean;
  FONT_16?: boolean;
  FONT_14?: boolean;
  FONT_12?: boolean;
  FONT_10?: boolean;
  FONT_9?: boolean;
  FONT_8?: boolean;
  FONT_6?: boolean;
}

const Text = (props: Props) => {
  const {
    children,
    bold,
    regular,
    medium,
    semiBold,
    light,
    extraBold,
    extraLight,
    black,
    color = colors.black,
    FONT_48,
    FONT_44,
    FONT_40,
    FONT_38,
    FONT_36,
    FONT_34,
    FONT_32,
    FONT_30,
    FONT_28,
    FONT_26,
    FONT_24,
    FONT_22,
    FONT_20,
    FONT_18,
    FONT_16,
    FONT_14,
    FONT_12,
    FONT_10,
    FONT_9,
    FONT_8,
    FONT_6,
  } = props;

  let fontFamily = fm.REGULAR;

  if (bold) fontFamily = fm.BOLD;
  if (light) fontFamily = fm.LIGHT;
  if (medium) fontFamily = fm.MEDIUM;
  if (semiBold) fontFamily = fm.SEMIBOLD;
  if (extraBold) fontFamily = fm.EXTRABOLD;
  if (extraLight) fontFamily = fm.EXTRALIGHT;
  if (black) fontFamily = fm.BLACK;

  let fontSize = fs.FONT_14;

  if (FONT_48) fontSize = fs.FONT_48;
  if (FONT_44) fontSize = fs.FONT_44;
  if (FONT_40) fontSize = fs.FONT_40;
  if (FONT_38) fontSize = fs.FONT_38;
  if (FONT_36) fontSize = fs.FONT_36;
  if (FONT_34) fontSize = fs.FONT_34;
  if (FONT_32) fontSize = fs.FONT_32;
  if (FONT_30) fontSize = fs.FONT_30;
  if (FONT_28) fontSize = fs.FONT_28;
  if (FONT_26) fontSize = fs.FONT_26;
  if (FONT_24) fontSize = fs.FONT_24;
  if (FONT_22) fontSize = fs.FONT_22;
  if (FONT_20) fontSize = fs.FONT_20;
  if (FONT_18) fontSize = fs.FONT_18;
  if (FONT_16) fontSize = fs.FONT_16;
  if (FONT_14) fontSize = fs.FONT_14;
  if (FONT_12) fontSize = fs.FONT_12;
  if (FONT_10) fontSize = fs.FONT_10;
  if (FONT_9) fontSize = fs.FONT_9;
  if (FONT_8) fontSize = fs.FONT_8;
  if (FONT_6) fontSize = fs.FONT_6;

  return (
    <RNText
      {...props}
      style={[
        {
          fontSize,
          color: color ? color : colors.secondary,
          fontFamily,
        },
        props?.style,
      ]}>
      {children}
    </RNText>
  );
};

export default Text;
