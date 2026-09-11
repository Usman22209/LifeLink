import { useQuery, useMutation } from "@tanstack/react-query";
import { SUPPORT_SERVICE, CreateReportPayload } from "../../api/service/support.service";
import Toast from "react-native-toast-message";
export const supportKeys = {
  all: ["support"] as const,
  reports: () => [...supportKeys.all, "reports"] as const,
};

export const useContactSupport = () => {
  return useMutation({
    mutationFn: async (data: { subject: string; message: string }) => {
      const response = await SUPPORT_SERVICE.submitContact(data);
      return response.data;
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Support Request Sent",
        text2: data?.message || "We will get back to you shortly.",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text2: error?.response?.data?.message || "Failed to submit request.",
      });
    },
  });
};

export const useSubmitReport = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: async (data: CreateReportPayload) => {
      const response = await SUPPORT_SERVICE.submitReport(data);
      return response.data;
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Report Submitted",
        text2: data?.message || "Thank you. Our moderation team has been notified.",
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Failed to Submit Report",
        text2: error?.response?.data?.message || "Please check your network and try again.",
      });
    },
  });
};
