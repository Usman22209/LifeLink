import { TextInputProps, ViewStyle } from "react-native";
import { Control } from "react-hook-form";

export interface AppInputProps extends TextInputProps {
  label?: string;
  value?: string;
  iconType?: any;
  iconName?: string;
  placeholder?: string;
  secureText?: boolean;
  onChangeText?: (text: string) => void;
  error?: string;
  inputStyle?: TextInputProps["style"];
  containerStyle?: ViewStyle;
  control?: Control<any>;
  name?: string;
}
