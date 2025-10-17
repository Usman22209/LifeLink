import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

type AppFlashListProps<T> = FlashListProps<T> & {
  loading?: boolean;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
  emptyStyle?: ViewStyle;
  emptyTextStyle?: TextStyle;
};

function AppFlashList<T>({
  data,
  renderItem,
  loading = false,
  emptyMessage = "No items available",
  estimatedItemSize,
  containerStyle,
  emptyStyle,
  emptyTextStyle,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
  ...props
}: AppFlashListProps<T>) {
  const DEFAULT_ESTIMATED_ITEM_SIZE = Math.max(80, moderateScale(120));

  const finalEstimatedItemSize =
    estimatedItemSize ?? DEFAULT_ESTIMATED_ITEM_SIZE;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  const emptyComponent = ListEmptyComponent ?? (
    <View style={[styles.emptyContainer, emptyStyle]}>
      <Text style={[styles.emptyText, emptyTextStyle]}>{emptyMessage}</Text>
    </View>
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <FlashList
        {...(props as FlashListProps<T>)}
        data={data}
        renderItem={renderItem}
        estimatedItemSize={finalEstimatedItemSize}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    minHeight: verticalScale(120),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: verticalScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: "#888",
  },
});

export default AppFlashList;
