import React from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet} from 'react-native';

interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationIn?: any;
  animationOut?: any;
  swipeDirection?: 'up' | 'down' | 'left' | 'right';
  backdropOpacity?: number;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isVisible,
  onClose,
  children,
  animationIn = 'fadeInUp',
  animationOut = 'fadeOutDown',
  swipeDirection = 'down',
  backdropOpacity = 0.5,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={swipeDirection}
      animationIn={animationIn}
      animationOut={animationOut}
      backdropOpacity={backdropOpacity}
      useNativeDriver
      useNativeDriverForBackdrop>
      <View style={styles.modalContainer}>{children}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default BaseModal;
