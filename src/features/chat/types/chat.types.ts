export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  role?: string;
  mobile?: string;
  email?: string;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string | null;
  image_url?: string | null;
  video_url?: string | null;
  is_read: boolean;
  reply_to?: ChatMessage | null;
  created_at: string;
  sender: ChatUser;
}

export interface Chat {
  id: number;
  other_user: ChatUser;
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface StartChatRequest {
  other_user_id: number;
}

export interface SendMessageRequest {
  message?: string;
  image?: File;
}

export interface GetMessagesResponse {
  data: ChatMessage[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
