import React from "react";
import { View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

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
                    <View style={styles.grabber} />
                    <Text bold FONT_16 style={styles.title}>{t("common.select") || "Select Source"}</Text>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onSelectSource('camera')}
                        >
                            <AnyIcon type={Icons.MaterialIcons} name="photo-camera" size={moderateScale(24)} color={colors.primary} />
                            <Text semiBold FONT_16 style={styles.optionTitle}>{t("common.camera") || "Camera"}</Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onSelectSource('gallery')}
                        >
                            <AnyIcon type={Icons.MaterialIcons} name="photo-library" size={moderateScale(24)} color={colors.primary} />
                            <Text semiBold FONT_16 style={styles.optionTitle}>{t("common.gallery") || "Gallery"}</Text>
                        </TouchableOpacity>

                        {showRemove && (
                            <>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={onRemove}
                                >
                                    <AnyIcon type={Icons.MaterialIcons} name="delete" size={moderateScale(24)} color={colors.primary} />
                                    <Text semiBold FONT_16 style={[styles.optionTitle, { color: colors.error }]}>{t("onboarding.removePhoto")}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text bold FONT_16 style={{ color: colors.textSecondary }}>{t("common.cancel")}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: moderateScale(25),
        borderTopRightRadius: moderateScale(25),
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(25),
    },
    grabber: {
        width: scale(40),
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: verticalScale(12),
    },
    title: {
        textAlign: 'center',
        marginBottom: verticalScale(20),
        color: colors.text,
    },
    optionsContainer: {
        backgroundColor: colors.card,
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: colors.border + '50',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        paddingHorizontal: scale(20),
    },
    optionTitle: {
        marginLeft: scale(15),
        color: colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border + '20',
        marginHorizontal: scale(15),
    },
    cancelButton: {
        marginTop: verticalScale(15),
        height: verticalScale(50),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.card,
    }
});
