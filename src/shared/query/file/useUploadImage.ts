import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { FILE_SERVICE } from "../../api/service/file.service";

export const useUploadImage = () => {
  return useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: (file: any) => FILE_SERVICE.uploadImage(file),

    onSuccess: (response) => {
      console.log("Upload success:", response.data);
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text2: error?.response?.data?.message || "Upload failed",
      });
    },
  });
};
