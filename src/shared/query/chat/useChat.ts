import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAT_SERVICE } from "../../api/service/chat.service";

export const chatKeys = {
  all: ["chat"] as const,
  threads: () => [...chatKeys.all, "threads"] as const,
  messages: (threadId: string) => [...chatKeys.all, "messages", threadId] as const,
};

export const useChatThreads = (enabled = true) => {
  return useQuery({
    queryKey: chatKeys.threads(),
    queryFn: async () => {
      const response = await CHAT_SERVICE.getThreads();
      return response.data?.data || response.data;
    },
    enabled,
  });
};

export const useChatMessages = (threadId: string, enabled = true) => {
  return useQuery({
    queryKey: chatKeys.messages(threadId),
    queryFn: async () => {
      const response = await CHAT_SERVICE.getMessages(threadId);
      return response.data?.data || response.data;
    },
    enabled: !!threadId && enabled,
    refetchInterval: 5000, // Polling fallback for real-time messages
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      thread_id?: string;
      request_id?: string;
      text: string;
    }) => {
      const response = await CHAT_SERVICE.sendMessage(data);
      return response.data?.data || response.data;
    },
    onSuccess: (resData, variables) => {
      const activeThreadId =
        variables.thread_id ||
        (resData as any)?.thread_id ||
        (resData as any)?.thread?.id;
      if (activeThreadId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(activeThreadId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: chatKeys.threads(),
      });
    },
  });
};
