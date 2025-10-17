import React, { ReactNode, useContext } from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { fontFamily as fm, fontSize as fs, fontFamilyUrdu } from '@theme/fonts';
import { ThemeContext } from '@providers/ThemeProvider';
import { useSelector } from 'react-redux';
import { selectLanguage, selectIsRtl } from '@store/slices/appSlice';

interface Props extends TextProps {
  children: ReactNode | undefined | any;
  color?: string;
  bold?: boolean;
  regular?: boolean;
  medium?: boolean;
  semiBold?: boolean;
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
    color,
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

  const theme = useContext(ThemeContext);
  const language = useSelector(selectLanguage);
  const isRtl = useSelector(selectIsRtl);

  const urduFont = fontFamilyUrdu;
  const engFont = fm;

  let fontFamily = isRtl ? urduFont.REGULAR : engFont.REGULAR;
  if (bold) fontFamily = isRtl ? urduFont.BOLD : engFont.BOLD;
  if (medium) fontFamily = isRtl ? urduFont.MEDIUM : engFont.MEDIUM;
  if (semiBold) fontFamily = isRtl ? urduFont.SEMIBOLD : engFont.SEMIBOLD;

  let fontSize = fs.FONT_14;
  if (FONT_48) fontSize = fs.FONT_48;
  else if (FONT_44) fontSize = fs.FONT_44;
  else if (FONT_40) fontSize = fs.FONT_40;
  else if (FONT_38) fontSize = fs.FONT_38;
  else if (FONT_36) fontSize = fs.FONT_36;
  else if (FONT_34) fontSize = fs.FONT_34;
  else if (FONT_32) fontSize = fs.FONT_32;
  else if (FONT_30) fontSize = fs.FONT_30;
  else if (FONT_28) fontSize = fs.FONT_28;
  else if (FONT_26) fontSize = fs.FONT_26;
  else if (FONT_24) fontSize = fs.FONT_24;
  else if (FONT_22) fontSize = fs.FONT_22;
  else if (FONT_20) fontSize = fs.FONT_20;
  else if (FONT_18) fontSize = fs.FONT_18;
  else if (FONT_16) fontSize = fs.FONT_16;
  else if (FONT_14) fontSize = fs.FONT_14;
  else if (FONT_12) fontSize = fs.FONT_12;
  else if (FONT_10) fontSize = fs.FONT_10;
  else if (FONT_9) fontSize = fs.FONT_9;
  else if (FONT_8) fontSize = fs.FONT_8;
  else if (FONT_6) fontSize = fs.FONT_6;

  const textColor = color ?? theme.text;

  return (
    <RNText
      {...props}
      style={[
        {
          fontSize,
          color: textColor,
          fontFamily,
          textAlign: isRtl ? 'right' : 'left',
          writingDirection: isRtl ? 'rtl' : 'ltr',
        },
        props?.style,
      ]}
    >
      {children}
    </RNText>
  );
};

export default Text;
