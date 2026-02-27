import { api } from "@/lib/api-client";
import {
  Chat,
  ChatMessage,
  StartChatRequest,
  SendMessageRequest,
  GetMessagesResponse,
} from "../types/chat.types";

const BASE_PATH = "/chats";

export const chatService = {
  /**
   * Start or resume a chat with a user
   */
  async startChat(data: StartChatRequest): Promise<Chat> {
    const formData = new FormData();
    formData.append("other_user_id", String(data.other_user_id));
    return api.post(`${BASE_PATH}/start`, formData);
  },

  /**
   * Get all chats for the current user
   */
  async getMyChats(): Promise<Chat[]> {
    const response = await api.get<{ data: Chat[] }>(`${BASE_PATH}/my-chats`);
    return response.data;
  },

  /**
   * Get messages for a specific chat
   */
  async getMessages(
    chatId: number,
    page: number = 1,
  ): Promise<GetMessagesResponse> {
    return api.get(`${BASE_PATH}/${chatId}/messages`, { per_page: 20, page });
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
