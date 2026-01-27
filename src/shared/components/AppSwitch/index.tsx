import React, { useEffect, useRef } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { colors } from "@theme/colors";
import Text from "@components/AppText";

interface AppSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
    description?: string;
}

const AppSwitch: React.FC<AppSwitchProps> = ({
    value,
    onValueChange,
    label,
    description,
}) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 250,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [moderateScale(2), moderateScale(22)],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onValueChange(!value)}
            style={styles.container}
        >
            <View style={styles.textContainer}>
                {label && (
                    <Text semiBold FONT_16 style={{ color: colors.text }}>
                        {label}
                    </Text>
                )}
                {description && (
                    <Text FONT_12 style={{ color: colors.textSecondary, marginTop: moderateScale(2) }}>
                        {description}
                    </Text>
                )}
            </View>
            <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
                <Animated.View style={[styles.switchThumb, { transform: [{ translateX }] }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

export default AppSwitch;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: moderateScale(12),
        width: "100%",
    },
    textContainer: {
        flex: 1,
        marginRight: scale(16),
    },
    switchTrack: {
        width: moderateScale(48),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        justifyContent: "center",
    },
    switchThumb: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 4,
    },
});
