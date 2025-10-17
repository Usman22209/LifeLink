// @ts-nocheck
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

//https://oblador.github.io/react-native-vector-icons/ to get name of icons
export const Icons = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
  Fontisto,
};

interface Props {
  type?: any;
  name?: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const AnyIcon = ({ type, name, size = 24, color = "#000", style }: Props) => {
  const Tag = type;
  if (!Tag || !name) return null;

  return <Tag name={name} size={size} color={color} style={style} />;
};

export default AnyIcon;
