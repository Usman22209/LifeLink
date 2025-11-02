import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";

type AppImageProps = FastImageProps & {
  placeholder?: React.ReactNode;
  fallbackSource?: FastImageProps["source"];
};

const AppImage: React.FC<AppImageProps> = ({
  source,
  style,
  placeholder,
  fallbackSource,
  resizeMode = FastImage.resizeMode.cover,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const handleError = (err?: any) => {
    console.warn("❌ Image load failed", err);
    if (fallbackSource) setUseFallback(true);
    setLoading(false);
  };

  return (
    <View style={[styles.container, style]}>
      {loading &&
        (placeholder ?? (
          <ActivityIndicator
            style={StyleSheet.absoluteFillObject}
            color="#999"
          />
        ))}

      <FastImage
        {...props}
        resizeMode={resizeMode}
        style={[styles.image, style]}
        source={useFallback && fallbackSource ? fallbackSource : source}
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default AppImage;
