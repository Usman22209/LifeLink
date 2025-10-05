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
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const handleError = () => {
    console.log("❌ Image load failed");
    if (fallbackSource) {
      setUseFallback(true); // switch to fallback
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, style]}>
      {loading && (
        placeholder ?? (
          <ActivityIndicator
            style={StyleSheet.absoluteFillObject}
            color="#999"
          />
        )
      )}

      <FastImage
        {...props}
        style={[StyleSheet.absoluteFill, style]}
        source={useFallback && fallbackSource ? fallbackSource : source}
        onLoadEnd={() => {
          console.log("✅ Loaded");
          setLoading(false);
        }}
        onError={handleError}
      />

      {useFallback === false && !loading && !fallbackSource && (
        <View style={[StyleSheet.absoluteFill, styles.errorBg]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  errorBg: {
    backgroundColor: "#d3d3d3",
  },
});

export default AppImage;
