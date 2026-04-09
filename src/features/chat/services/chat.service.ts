import { api } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";
import {
  Chat,
  ChatMessage,
  StartChatRequest,
  SendMessageRequest,
  GetMessagesResponse,
} from "../types/chat.types";

const BASE_PATH = "/chats";

const parseId = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const normalizeChatMessage = (message: any): ChatMessage => ({
  id: parseId(message?.id ?? message?.message_id),
  chat_id: parseId(message?.chat_id ?? message?.chatId ?? message?.chat?.id),
  sender_id: parseId(
    message?.sender_id ?? message?.senderId ?? message?.sender?.id ?? message?.user_id,
  ),
  message: message?.message ?? message?.content ?? null,
  image_url: message?.image_url ?? message?.imageUrl ?? null,
  video_url: message?.video_url ?? message?.videoUrl ?? null,
  is_read: Boolean(message?.is_read ?? message?.isRead ?? false),
  reply_to: message?.reply_to ?? message?.replyTo ?? null,
  created_at: String(message?.created_at ?? message?.createdAt ?? ""),
  sender: {
    id: parseId(message?.sender?.id ?? message?.user?.id),
    name: message?.sender?.name ?? message?.user?.name ?? "",
    avatar: message?.sender?.avatar ?? message?.user?.avatar ?? undefined,
    role: message?.sender?.role ?? message?.user?.role ?? undefined,
    mobile: message?.sender?.mobile ?? message?.user?.mobile ?? undefined,
    email: message?.sender?.email ?? message?.user?.email ?? undefined,
  },
});

const normalizeChat = (chat: any): Chat => ({
  id: parseId(chat?.id ?? chat?.chat_id ?? chat?.chatId),
  other_user:
    chat?.other_user ??
    chat?.otherUser ??
    chat?.receiver ??
    chat?.participant ??
    chat?.user ?? {
      id: 0,
      name: "",
    },
  last_message: chat?.last_message
    ? normalizeChatMessage(chat.last_message)
    : chat?.lastMessage
      ? normalizeChatMessage(chat.lastMessage)
      : undefined,
  unread_count: Number(chat?.unread_count ?? chat?.unreadCount ?? 0),
  created_at: String(chat?.created_at ?? chat?.createdAt ?? ""),
  updated_at: String(chat?.updated_at ?? chat?.updatedAt ?? ""),
});

export const chatService = {
  /**
   * Start or resume a chat with a user
   */
  async startChat(data: StartChatRequest): Promise<Chat> {
    const formData = new FormData();
    formData.append("other_user_id", String(data.other_user_id));
    if (data.property_id && Number.isFinite(data.property_id)) {
      formData.append("property_id", String(data.property_id));
    }
    try {
      return await api.post(`${BASE_PATH}/start`, formData);
    } catch (error) {
      // Some backend deployments may not accept property_id in /start payload yet.
      if (error instanceof ApiError && error.code === 422 && data.property_id) {
        const fallbackFormData = new FormData();
        fallbackFormData.append("other_user_id", String(data.other_user_id));
        return api.post(`${BASE_PATH}/start`, fallbackFormData);
      }
      throw error;
    }
  },

  /**
   * Get all chats for the current user
   */
  async getMyChats(): Promise<Chat[]> {
    const response = await api.get<any>(`${BASE_PATH}/my-chats`);

    // API client may already unwrap { data: ... }, but some deployments
    // still return nested payloads. Normalize all common shapes.
    const rawChats = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.chats)
          ? response.chats
          : Array.isArray(response?.data?.chats)
            ? response.data.chats
            : [];

    return rawChats
      .map(normalizeChat)
      .filter((chat) => Number.isFinite(chat.id) && chat.id > 0);
  },

  /**
   * Get messages for a specific chat
   */
  async getMessages(
    chatId: number,
    page: number = 1,
  ): Promise<GetMessagesResponse> {
    const response = await api.get<any>(`${BASE_PATH}/${chatId}/messages`, {
      per_page: 20,
      page,
    });

    const rawMessages = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.messages)
        ? response.messages
        : Array.isArray(response?.data?.messages)
          ? response.data.messages
          : Array.isArray(response)
            ? response
            : [];

    const meta =
      response?.meta ??
      response?.pagination ?? {
        current_page: page,
        last_page: 1,
        per_page: 20,
        total: rawMessages.length,
      };

    return {
      data: rawMessages.map(normalizeChatMessage),
      meta: {
        current_page: Number(meta?.current_page ?? meta?.currentPage ?? page),
        last_page: Number(meta?.last_page ?? meta?.lastPage ?? 1),
        per_page: Number(meta?.per_page ?? meta?.perPage ?? 20),
        total: Number(meta?.total ?? rawMessages.length),
      },
    };
  },

  /**
   * Send a message to a chat
   */
  async sendMessage(
    chatId: number,
    data: SendMessageRequest,
  ): Promise<ChatMessage> {
    const formData = new FormData();
    if (data.message) {
      formData.append("message", data.message);
    }
    if (data.image) {
      formData.append("image", data.image);
    }
    return api.post(`${BASE_PATH}/${chatId}/send`, formData);
  },

  /**
   * Mark a chat as read
   */
  async markAsRead(chatId: number): Promise<void> {
    return api.post(`${BASE_PATH}/${chatId}/mark-read`, {});
  },

  /**
   * Get unread messages count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>(
      `${BASE_PATH}/unread-count`,
    );
    return response.count;
  },

  /**
   * Delete a message for the current user
   */
  async deleteMessage(messageId: number): Promise<void> {
    return api.del(`${BASE_PATH}/message/${messageId}`);
  },

  /**
   * Delete a message for updates for everyone
   */
  async deleteMessageForEveryone(messageId: number): Promise<void> {
    return api.del(`${BASE_PATH}/message/${messageId}/for-everyone`);
  },

  /**
   * Clear messages in a chat for the current user
   */
  async clearChat(chatId: number): Promise<void> {
    return api.del(`${BASE_PATH}/chats/${chatId}/messages/clear-for-me`);
  },
};
