import { useQuery, useMutation } from "@tanstack/react-query";
import { SUPPORT_SERVICE } from "../../api/service/support.service";
import Toast from "react-native-toast-message";

export const supportKeys = {
  all: ["support"] as const,
  faqs: () => [...supportKeys.all, "faqs"] as const,
};

export const useFaqs = (enabled = true) => {
  return useQuery({
    queryKey: supportKeys.faqs(),
    queryFn: async () => {
      const response = await SUPPORT_SERVICE.getFaqs();
      return response.data?.data || response.data;
    },
    enabled,
  });
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
