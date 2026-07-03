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
import { verticalScale, moderateScale } from "react-native-size-matters";

export interface AppFlashListProps<T> extends Omit<
  FlashListProps<T>,
  "estimatedItemSize"
> {
  estimatedItemSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
  emptyStyle?: ViewStyle;
  emptyTextStyle?: TextStyle;
}

function AppFlashListInner<T>(
  {
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
  }: AppFlashListProps<T>,
  ref: React.Ref<any>,
) {
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
        ref={ref}
        {...(props as any)}
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

const AppFlashList = React.forwardRef(AppFlashListInner) as <T>(
  props: AppFlashListProps<T> & { ref?: React.Ref<any> },
) => React.ReactElement;

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
