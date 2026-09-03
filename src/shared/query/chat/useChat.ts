import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAT_SERVICE } from "../../api/service/chat.service";
import { supabase } from "@shared/config/supabase";

export const chatKeys = {
  all: ["chat"] as const,
  threads: () => [...chatKeys.all, "threads"] as const,
  messages: (threadId: string) => [...chatKeys.all, "messages", threadId] as const,
};

export const useChatThreads = (enabled = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Real-time listener for chat_threads and new chat messages across all user threads
    const channel = supabase
      .channel("public:chat_threads_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_threads" },
        () => {
          queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);

  return useQuery({
    queryKey: chatKeys.threads(),
    queryFn: async () => {
      const response = await CHAT_SERVICE.getThreads();
      return response.data?.data || response.data;
    },
    enabled,
    staleTime: 10000,
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
    staleTime: 1500,
    refetchInterval: 2500,
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
      const targetIds = [
        variables.thread_id,
        variables.request_id,
        (resData as any)?.thread_id,
        (resData as any)?.thread?.id,
      ].filter(Boolean) as string[];

      const createdMsg =
        (resData as any)?.message || (resData as any)?.data || resData;

      targetIds.forEach((id) => {
        if (createdMsg && createdMsg.text) {
          queryClient.setQueryData(chatKeys.messages(id), (oldData: any) => {
            if (!oldData) return oldData;
            const rawList =
              oldData.messages || (Array.isArray(oldData) ? oldData : []);
            if (
              rawList.some((m: any) => String(m.id) === String(createdMsg.id))
            ) {
              return oldData;
            }
            const updatedList = [...rawList, createdMsg];
            return oldData.messages
              ? { ...oldData, messages: updatedList }
              : updatedList;
          });
        }
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(id),
        });
      });

      queryClient.invalidateQueries({
        queryKey: chatKeys.threads(),
      });
    },
  });
};

export const useMarkThreadAsRead = () => {
  const queryClient = useQueryClient();

  return {
    mutate: (threadId: string) => {
      if (!threadId) return;
      queryClient.setQueryData(chatKeys.threads(), (oldData: any) => {
        if (!oldData) return oldData;
        const raw = oldData.data || (Array.isArray(oldData) ? oldData : []);
        const updated = raw.map((t: any) =>
          String(t.id) === String(threadId)
            ? { ...t, unreadCount: 0, unread_count: 0 }
            : t
        );
        return oldData.data ? { ...oldData, data: updated } : updated;
      });
    },
  };
};
