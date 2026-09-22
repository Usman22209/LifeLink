import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";

export const CHAT_SERVICE = {
  getThreads: () => {
    return HTTP_CLIENT.get(API_CONFIG.CHAT.threads);
  },
  getMessages: (
    threadId: string,
    params?: { page?: number; limit?: number },
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.CHAT.threads}/${threadId}/messages?${queryString}`
      : `${API_CONFIG.CHAT.threads}/${threadId}/messages`;

    return HTTP_CLIENT.get(url);
  },
  sendMessage: (data: {
    thread_id?: string;
    request_id?: string;
    text: string;
  }) => {
    return HTTP_CLIENT.post(API_CONFIG.CHAT.messages, data);
  },
};
