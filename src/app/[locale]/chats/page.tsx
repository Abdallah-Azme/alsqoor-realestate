"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Loader2, Send } from "lucide-react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { useGetMessages, useMarkAsRead, useMyChats, useSendMessage } from "@/features/chat/hooks/use-chat";
import { ChatMessage } from "@/features/chat/types/chat.types";
import { getPusherClient } from "@/lib/pusher";

const extractUserId = (rawUser: any): number | null => {
  const candidate =
    rawUser?.id ??
    rawUser?.user?.id ??
    rawUser?.data?.id ??
    rawUser?.profile?.id;
  const parsed = Number(candidate);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getMessageSenderId = (msg: any): number | null => {
  const candidate =
    msg?.sender_id ??
    msg?.senderId ??
    msg?.sender?.id ??
    msg?.user_id ??
    msg?.userId;
  const parsed = Number(candidate);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default function ChatsPage() {
  const t = useTranslations("property_chat");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const { data: chats = [], isLoading: loadingChats } = useMyChats();
  const { data: messagesResponse, isLoading: loadingMessages } =
    useGetMessages(selectedChatId);
  const markAsReadMutation = useMarkAsRead();
  const sendMessageMutation = useSendMessage(selectedChatId || 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      const id = extractUserId(user);
      if (id) setCurrentUserId(id);
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(Number(chats[0].id));
    }
  }, [selectedChatId, chats]);

  useEffect(() => {
    if (selectedChatId) {
      markAsReadMutation.mutate(selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (messagesResponse?.data) {
      setLocalMessages([...messagesResponse.data].reverse());
    }
  }, [messagesResponse]);

  useEffect(() => {
    if (!selectedChatId) return;
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `private-chat.${selectedChatId}`;
    const channel = pusher.subscribe(channelName);

    const onIncomingMessage = (payload: {
      message?: ChatMessage;
      data?: ChatMessage;
    }) => {
      const incoming = payload?.message ?? payload?.data;
      if (!incoming) return;

      setLocalMessages((prev) => {
        const exists = prev.some((m) => m.id === incoming.id);
        if (exists) return prev;
        return [...prev, incoming];
      });
      markAsReadMutation.mutate(selectedChatId);
    };

    channel.bind("new-message", onIncomingMessage);
    channel.bind("message.sent", onIncomingMessage);
    channel.bind("App\\Events\\MessageSent", onIncomingMessage);

    return () => {
      channel.unbind("new-message", onIncomingMessage);
      channel.unbind("message.sent", onIncomingMessage);
      channel.unbind("App\\Events\\MessageSent", onIncomingMessage);
      pusher.unsubscribe(channelName);
    };
  }, [selectedChatId, markAsReadMutation]);

  const selectedChat = useMemo(
    () => chats.find((c: any) => Number(c.id) === selectedChatId),
    [chats, selectedChatId],
  );

  const messages = useMemo(() => localMessages, [localMessages]);

  const handleSend = () => {
    const text = messageText.trim();
    if (!text || !selectedChatId) return;
    sendMessageMutation.mutate(
      { message: text },
      {
        onSuccess: (newMessage) => {
          setMessageText("");
          setLocalMessages((prev) => {
            const exists = prev.some((m) => m.id === (newMessage as any)?.id);
            if (exists) return prev;
            return [...prev, newMessage as ChatMessage];
          });
        },
      },
    );
  };

  return (
    <main className="container py-8 space-y-6">
      <CustomBreadcrumbs items={[{ label: "المحادثات" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b font-bold text-main-navy">
            {t("open_chat") || "المحادثات"}
          </div>
          <div className="max-h-[65vh] overflow-y-auto">
            {loadingChats ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-main-green" />
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-sm text-gray-500 text-center">
                {t("no_messages") || "لا توجد محادثات بعد"}
              </div>
            ) : (
              chats.map((chat: any) => {
                const active = Number(chat.id) === selectedChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChatId(Number(chat.id))}
                    className={`w-full px-4 py-3 text-right border-b hover:bg-gray-50 transition-colors ${
                      active ? "bg-main-green/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={chat.other_user?.avatar || "/images/state.png"}
                          alt={chat.other_user?.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-main-navy truncate">
                          {chat.other_user?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {chat.last_message?.message || t("open_chat")}
                        </p>
                      </div>
                      {Number(chat.unread_count) > 0 && (
                        <span className="text-xs rounded-full bg-red-500 text-white px-2 py-0.5">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b font-bold text-main-navy">
            {selectedChat?.other_user?.name || (t("owner_details") || "المحادثة")}
          </div>

          <div className="h-[55vh] overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {!selectedChatId ? (
              <div className="text-sm text-gray-500 text-center py-8">
                {t("no_messages") || "اختر محادثة"}
              </div>
            ) : loadingMessages ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-main-green" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">
                {t("no_messages") || "لا توجد رسائل"}
              </div>
            ) : (
              messages.map((msg: any) => {
                const isMine =
                  currentUserId !== null &&
                  getMessageSenderId(msg) === Number(currentUserId);
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        isMine
                          ? "bg-main-green text-white rounded-tr-none"
                          : "bg-white border border-gray-200 text-main-navy rounded-tl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("write_message") || "كتابة الرسالة..."}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-main-green"
              disabled={!selectedChatId || sendMessageMutation.isPending}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!selectedChatId || !messageText.trim() || sendMessageMutation.isPending}
              className="size-10 rounded-full bg-main-green text-white flex items-center justify-center disabled:opacity-50"
              aria-label="Send"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

