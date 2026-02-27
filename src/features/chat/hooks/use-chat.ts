"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { StartChatRequest, SendMessageRequest } from "../types/chat.types";
import { toast } from "sonner";

export function useStartChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartChatRequest) => chatService.startChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useMyChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => chatService.getMyChats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetMessages(chatId: number | null, page: number = 1) {
  return useQuery({
    queryKey: ["messages", chatId, page],
    queryFn: () => chatService.getMessages(chatId!, page),
    enabled: !!chatId,
    staleTime: 30 * 1000,
  });
}

export function useSendMessage(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) =>
      chatService.sendMessage(chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: number) => chatService.markAsRead(chatId),
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: () => chatService.getUnreadCount(),
    staleTime: 60 * 1000,
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
