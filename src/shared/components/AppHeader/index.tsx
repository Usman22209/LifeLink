import React from "react";
import { View, StyleSheet, TouchableOpacity, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
    backgroundColor?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBackButton = false,
    onBackPress,
    rightComponent,
    backgroundColor = colors.background,
}) => {
    const navigation = useNavigation();
    const isRtl = I18nManager.isRTL;

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.header, { backgroundColor, flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <AnyIcon
                            type={Icons.Ionicons}
                            name={isRtl ? "chevron-forward" : "chevron-back"}
                            size={moderateScale(24)}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.titleContainer}>
                {title && (
                    <Text bold FONT_18 style={styles.title}>
                        {title}
                    </Text>
                )}
            </View>

            <View style={styles.rightContainer}>
                {rightComponent}
            </View>
        </View>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    header: {
        height: verticalScale(56),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '15',
    },
    leftContainer: {
        width: moderateScale(40),
        alignItems: "flex-start",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    rightContainer: {
        width: moderateScale(40),
        alignItems: "flex-end",
    },
    title: {
        color: colors.text,
    },
    backButton: {
        padding: moderateScale(4),
    },
});
