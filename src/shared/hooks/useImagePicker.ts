import { useState, useCallback } from "react";
import ImagePicker, { Image, Video } from "react-native-image-crop-picker";

type MediaType = "photo" | "video" | "any";
type MediaResult = Image | Video;

type CameraOptions = {
  mediaType: MediaType;
  cropping?: boolean;
  compressQuality?: number;
  durationLimit?: number;
};

type PickerOptions<T extends boolean> = {
  mediaType: MediaType;
  cropping?: boolean;
  multiple: T;
  maxFiles?: number;
  compressQuality?: number;
};

type MediaPickerResult<T extends boolean> = {
  media: T extends true ? MediaResult[] : MediaResult | null;
  error: string | null;
  pickFromCamera: (options: CameraOptions) => Promise<void>;
  pickFromGallery: (
    options: Pick<PickerOptions<T>, "mediaType" | "cropping" | "compressQuality"> & {
      multiple?: boolean;
      maxFiles?: number;
    },
  ) => Promise<void>;
  clearMedia: () => void;
  selectedCount: number;
};

const useMediaPicker = <T extends boolean = false>(): MediaPickerResult<T> => {
  const [media, setMedia] = useState<MediaResult[] | MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const handleError = useCallback((err: unknown): string => {
    const defaultError = "Failed to pick media";
    if (typeof err === "object" && err !== null) {
      const error = err as { code?: string; message?: string };
      if (error.code === "E_PICKER_CANCELLED") return "";
      return error.message || defaultError;
    }
    return defaultError;
  }, []);

  const processMediaResult = useCallback((result: MediaResult | MediaResult[]): MediaResult[] => {
    if (Array.isArray(result)) return result;
    return [result];
  }, []);

  const pickFromCamera = useCallback(
    async (options: CameraOptions) => {
      try {
        setError(null);
        const result = await ImagePicker.openCamera({
          mediaType: options.mediaType,
          cropping: options.cropping,
          compressQuality: options.compressQuality || 80,
          includeBase64: true,
          durationLimit: options.durationLimit,
        });

        setMedia(result);
        setSelectedCount(1);
      } catch (err) {
        const errorMessage = handleError(err);
        if (errorMessage) setError(errorMessage);
      }
    },
    [handleError],
  );

  const pickFromGallery = useCallback(
    async (
      options: Pick<PickerOptions<T>, "mediaType" | "cropping" | "compressQuality"> & {
        multiple?: boolean;
        maxFiles?: number;
      },
    ) => {
      try {
        setError(null);
        const result = await ImagePicker.openPicker({
          mediaType: options.mediaType,
          cropping: options.cropping,
          multiple: options.multiple,
          maxFiles: options.maxFiles,
          compressQuality: options.compressQuality || 80,
          includeBase64: true,
        });

        const processedMedia = processMediaResult(result);
        setMedia(options.multiple ? processedMedia : processedMedia[0]);
        setSelectedCount(processedMedia.length);
      } catch (err) {
        const errorMessage = handleError(err);
        if (errorMessage) setError(errorMessage);
      }
    },
    [handleError, processMediaResult],
  );

  const clearMedia = useCallback(() => {
    setMedia(null);
    setError(null);
    setSelectedCount(0);
  }, []);

  return {
    media: media as MediaPickerResult<T>["media"],
    error,
    pickFromCamera,
    pickFromGallery,
    clearMedia,
    selectedCount,
  };
};

export default useMediaPicker;
