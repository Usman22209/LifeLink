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
    refetchInterval: 15000,
  });
};

export const useChatMessages = (threadId: string, enabled = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!threadId || !enabled) return;

    // Real-time listener for instant message delivery in the active thread channel
    const channel = supabase
      .channel(`chat_messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          queryClient.setQueryData(
            chatKeys.messages(threadId),
            (oldData: any) => {
              if (!oldData) {
                queryClient.invalidateQueries({
                  queryKey: chatKeys.messages(threadId),
                });
                return oldData;
              }

              const rawList =
                oldData.messages || (Array.isArray(oldData) ? oldData : []);

              const exists = rawList.some(
                (m: any) => String(m.id) === String(newMsg.id)
              );
              if (exists) return oldData;

              const updatedList = [...rawList, newMsg];

              if (oldData.messages) {
                return { ...oldData, messages: updatedList };
              }
              return updatedList;
            }
          );

          // Invalidate thread list to update thread last message preview and timestamp
          queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, enabled, queryClient]);

  return useQuery({
    queryKey: chatKeys.messages(threadId),
    queryFn: async () => {
      const response = await CHAT_SERVICE.getMessages(threadId);
      return response.data?.data || response.data;
    },
    enabled: !!threadId && enabled,
    refetchInterval: 15000,
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
