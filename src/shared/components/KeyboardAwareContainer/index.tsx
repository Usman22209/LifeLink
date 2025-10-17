import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet, ViewStyle } from "react-native";
import { verticalScale } from "react-native-size-matters";

interface KeyboardAwareContainerProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}
const KeyboardAwareContainer: React.FC<KeyboardAwareContainerProps> = ({
  children,
  contentContainerStyle,
}) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets={true}
      showsHorizontalScrollIndicator={false}
      enableAutomaticScroll={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.keyboardContainer, contentContainerStyle]}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flexGrow: 1,
    paddingBottom: verticalScale(50),
  },
});

export default KeyboardAwareContainer;
