import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Text from '@components/AppText';

interface EmptyListItemProps {
  message?: string;
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
}

const EmptyListItem: React.FC<EmptyListItemProps> = ({
  message = 'No items found.',
  containerStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.message, textStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmptyListItem;
