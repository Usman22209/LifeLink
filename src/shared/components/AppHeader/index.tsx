import React from "react";
import { View, StyleSheet, TouchableOpacity, I18nManager, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

export interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightIcon?: string;
    rightIconType?: any;
    onRightPress?: () => void;
    backgroundColor?: string;
    titleColor?: string;
    iconColor?: string;
    hasBorder?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBackButton = false,
    onBackPress,
    rightIcon,
    rightIconType = Icons.MaterialIcons,
    onRightPress,
    backgroundColor = colors.background,
    titleColor = colors.text,
    iconColor = colors.text,
    hasBorder = false,
}) => {
    const navigation = useNavigation();
    const isRtl = I18nManager.isRTL;
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor,
                paddingTop: insets.top,
                borderBottomWidth: hasBorder ? 0.8 : 0,
                borderBottomColor: colors.border,
                shadowColor: colors.border,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 3,
            }
        ]}>
            <View style={[styles.headerRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                {/* Left Action */}
                <View style={styles.actionContainer}>
                    {showBackButton && (
                        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                            <AnyIcon
                                type={Icons.Ionicons}
                                name={isRtl ? "chevron-forward" : "chevron-back"}
                                size={moderateScale(24)}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    {title && (
                        <Text
                            bold
                            FONT_18
                            numberOfLines={1}
                            style={[styles.titleText, { color: titleColor }]}
                        >
                            {title}
                        </Text>
                    )}
                </View>

                {/* Right Action */}
                <View style={styles.actionContainer}>
                    {rightIcon && (
                        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                            <AnyIcon
                                type={rightIconType}
                                name={rightIcon}
                                size={moderateScale(24)}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 10,
    },
    headerRow: {
        paddingVertical: verticalScale(12),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(8),
    },
    actionContainer: {
        width: scale(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        textAlign: 'center',
    },
    iconButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppHeader;
