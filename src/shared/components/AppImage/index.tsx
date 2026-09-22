import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";
import FastImage, { FastImageProps, Source } from "react-native-fast-image";

export type AppImageProps = Omit<FastImageProps, "source" | "resizeMode"> & {
  source?: FastImageProps["source"] | ImageSourcePropType | string | any;
  placeholder?: React.ReactNode;
  fallbackSource?:
    | FastImageProps["source"]
    | ImageSourcePropType
    | string
    | any;
  fallbackComponent?: React.ReactNode;
  resizeMode?:
    | FastImageProps["resizeMode"]
    | "cover"
    | "contain"
    | "stretch"
    | "center";
  children?: React.ReactNode;
};

const isValidUri = (uri?: string | null): boolean => {
  if (!uri || typeof uri !== "string") return false;
  const trimmed = uri.trim();
  if (!trimmed) return false;
  if (trimmed.includes("cdn.lifelink.org")) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("file://") ||
    trimmed.startsWith("content://") ||
    trimmed.startsWith("data:")
  );
};

export const isValidSource = (source: any): boolean => {
  if (!source) return false;
  if (typeof source === "number") return true;
  if (typeof source === "string") return isValidUri(source);
  if (typeof source === "object") {
    if (source.uri) return isValidUri(source.uri);
    if (source.default) return isValidSource(source.default);
    return true;
  }
  return false;
};

const normalizeSource = (source: any): Source | number => {
  if (!source) return { uri: "" };
  if (typeof source === "number") return source;
  if (typeof source === "string") {
    return {
      uri: source.trim(),
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
  }
  if (typeof source === "object") {
    const raw = source.default || source;
    if (typeof raw === "number") return raw;
    if (raw.uri) {
      return {
        uri: String(raw.uri).trim(),
        priority: raw.priority || FastImage.priority.normal,
        headers: raw.headers,
        cache: raw.cache || FastImage.cacheControl.immutable,
      };
    }
    return raw;
  }
  return { uri: "" };
};

const getSourceKey = (source: any): string => {
  if (!source) return "";
  if (typeof source === "number") return String(source);
  if (typeof source === "string") return source.trim();
  if (typeof source === "object") {
    const raw = source.default || source;
    if (typeof raw === "number") return String(raw);
    if (raw.uri) return String(raw.uri).trim();
  }
  return "";
};

const AppImage: React.FC<AppImageProps> = ({
  source,
  style,
  placeholder,
  fallbackSource,
  fallbackComponent,
  resizeMode = FastImage.resizeMode.cover,
  children,
  ...props
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const activeSource = useFallback && fallbackSource ? fallbackSource : source;
  const currentKey = getSourceKey(activeSource);
  const isInitialValid = isValidSource(activeSource);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(!isInitialValid);

  const prevKeyRef = useRef(currentKey);

  useEffect(() => {
    if (prevKeyRef.current !== currentKey) {
      prevKeyRef.current = currentKey;
      const valid = isValidSource(activeSource);
      setHasError(!valid);
      setUseFallback(false);
      setIsLoading(valid);
    }
  }, [currentKey, activeSource]);

  const handleError = () => {
    if (fallbackSource && !useFallback) {
      setUseFallback(true);
      setHasError(false);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
      if (props.onError) {
        props.onError();
      }
    }
  };

  const handleLoad = (e: any) => {
    setIsLoading(false);
    setHasError(false);
    if (props.onLoad) {
      (props.onLoad as any)(e);
    }
  };

  if (hasError && !useFallback) {
    return (
      <View style={[styles.container, style]}>
        {fallbackComponent ?? placeholder ?? null}
      </View>
    );
  }

  let mappedResizeMode: any = FastImage.resizeMode.cover;
  if (
    resizeMode === "contain" ||
    (resizeMode as any) === FastImage.resizeMode.contain
  ) {
    mappedResizeMode = FastImage.resizeMode.contain;
  } else if (
    resizeMode === "stretch" ||
    (resizeMode as any) === FastImage.resizeMode.stretch
  ) {
    mappedResizeMode = FastImage.resizeMode.stretch;
  } else if (
    resizeMode === "center" ||
    (resizeMode as any) === FastImage.resizeMode.center
  ) {
    mappedResizeMode = FastImage.resizeMode.center;
  } else {
    mappedResizeMode = FastImage.resizeMode.cover;
  }

  const fastSource = normalizeSource(activeSource);

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={StyleSheet.absoluteFillObject}>
          {placeholder ?? (
            <ActivityIndicator
              style={StyleSheet.absoluteFillObject}
              color="#999"
            />
          )}
        </View>
      )}

      <FastImage
        {...props}
        resizeMode={mappedResizeMode}
        style={[styles.image, style]}
        source={fastSource}
        onLoad={handleLoad}
        onError={handleError}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default AppImage;
