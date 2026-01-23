import React from "react";
import { View, StyleSheet } from "react-native";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";
import Text from "@components/AppText";
import { colors } from "@theme/colors";

interface OnboardingHeaderProps {
    title: string;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text bold FONT_20 style={styles.headerTitle}>
                {title}
            </Text>
        </View>
    );
};

export default OnboardingHeader;

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '30',
    },
    headerTitle: {
        color: colors.text,
    },
});
