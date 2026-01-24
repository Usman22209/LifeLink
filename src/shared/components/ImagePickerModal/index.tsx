import React from "react";
import { View, TouchableOpacity, Modal, StyleSheet, Dimensions } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

const { width } = Dimensions.get("window");

interface ImagePickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectSource: (type: 'camera' | 'gallery') => void;
    showRemove?: boolean;
    onRemove?: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
    isVisible,
    onClose,
    onSelectSource,
    showRemove,
    onRemove
}) => {
    const { t } = useTranslation();

    const OptionButton = ({
        onPress,
        icon,
        label,
        isDestructive = false
    }: {
        onPress: () => void;
        icon: string;
        label: string;
        isDestructive?: boolean;
    }) => (
        <TouchableOpacity
            style={styles.optionButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[
                styles.iconCircle,
                { backgroundColor: isDestructive ? colors.error + '20' : colors.primary + '20' }
            ]}>
                <AnyIcon
                    type={Icons.MaterialIcons}
                    name={icon}
                    size={moderateScale(22)}
                    color={isDestructive ? colors.error : colors.primary}
                />
            </View>
            <Text semiBold FONT_16 style={[
                styles.optionLabel,
                { color: isDestructive ? colors.error : colors.text }
            ]}>
                {label}
            </Text>
            <AnyIcon
                type={Icons.Feather}
                name="chevron-right"
                size={moderateScale(18)}
                color={isDestructive ? colors.error + '40' : colors.textSecondary + '80'}
            />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            <Text bold FONT_18 style={styles.title}>
                                {t("common.select") || "Select Source"}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <AnyIcon
                                type={Icons.Ionicons}
                                name="close"
                                size={moderateScale(20)}
                                color={colors.text}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsList}>
                        <OptionButton
                            onPress={() => onSelectSource('camera')}
                            icon="photo-camera"
                            label={t("common.camera") || "Camera"}
                        />

                        <View style={styles.separator} />

                        <OptionButton
                            onPress={() => onSelectSource('gallery')}
                            icon="photo-library"
                            label={t("common.gallery") || "Gallery"}
                        />

                        {showRemove && (
                            <>
                                <View style={styles.separator} />
                                <OptionButton
                                    onPress={onRemove!}
                                    icon="delete"
                                    label={t("onboarding.removePhoto")}
                                    isDestructive
                                />
                            </>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(35),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
        paddingVertical: verticalScale(10),
    },
    headerTitleContainer: {
        flex: 1,
    },
    title: {
        color: colors.text,
    },
    closeButton: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: colors.border + '20', // Drarker than before
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsList: {
        // Transparent and no padding for minimalist look
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(12),
        borderRadius: moderateScale(15),
    },
    iconCircle: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        flex: 1,
        marginLeft: scale(15),
    },
    separator: {
        height: 1,
        backgroundColor: colors.border + 'cc',
        marginHorizontal: -scale(8), // Matches parent padding to go full-width
    },
});
