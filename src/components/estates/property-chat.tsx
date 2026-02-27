"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  useStartChat,
  useGetMessages,
  useSendMessage,
  useMarkAsRead,
} from "@/features/chat/hooks/use-chat";
import { pusher } from "@/lib/pusher";
import { ChatMessage } from "@/features/chat/types/chat.types";
import { Loader2 } from "lucide-react";

interface OwnerInfo {
  name: string;
  location: string;
  image: string;
}

interface PropertyChatProps {
  owner?: OwnerInfo;
  ownerId?: string | number;
  propertyId?: number | string;
}

export default function PropertyChat({
  owner,
  ownerId,
  propertyId,
}: PropertyChatProps) {
  const t = useTranslations("property_chat");
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current user ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUserId(user.id);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, []);

  // 1. Start/Get Chat once ownerId and currentUserId are known
  const startChatMutation = useStartChat();

  // Don't attempt to start a chat if the viewer IS the owner
  const isOwnProperty =
    ownerId && currentUserId && Number(ownerId) === currentUserId;

  useEffect(() => {
    if (isOwnProperty) return; // no self-chat
    if (ownerId && currentUserId && !chatStarted) {
      setChatStarted(true);
      startChatMutation.mutate(
        { other_user_id: Number(ownerId) },
        {
          onSuccess: (data) => {
            setChatId(data.id);
          },
          onError: (err: any) => {
            console.error("Failed to start chat", err);
            // Don't reset chatStarted to false, so it doesn't retry infinitely
          },
        },
      );
    }
  }, [ownerId, currentUserId, chatStarted, isOwnProperty]);

  // 2. Get Messages
  const { data: messagesResponse, isLoading: isMessagesLoading } =
    useGetMessages(chatId);

  useEffect(() => {
    if (messagesResponse?.data) {
      // API returns newest-first, we want oldest-first order for display
      setLocalMessages([...messagesResponse.data].reverse());
    }
  }, [messagesResponse]);

  // 3. Mark as Read on chat open
  const markAsReadMutation = useMarkAsRead();
  useEffect(() => {
    if (chatId) {
      markAsReadMutation.mutate(chatId);
    }
  }, [chatId]);

  // 4. Pusher Real-time Subscription
  useEffect(() => {
    if (!chatId) return;

    const channelName = `private-chat.${chatId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (data: { message: ChatMessage }) => {
      // Only add if not from current user (to avoid duplicates from optimistic updates)
      setLocalMessages((prev) => {
        const alreadyExists = prev.some((m) => m.id === data.message.id);
        if (alreadyExists) return prev;
        return [...prev, data.message];
      });
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [chatId]);

  // 5. Send Message
  const sendMessageMutation = useSendMessage(chatId || 0);

  const handleSend = () => {
    if (!messageText.trim() || !chatId) return;

    const text = messageText;
    setMessageText(""); // clear immediately for better UX

    sendMessageMutation.mutate(
      { message: text },
      {
        onSuccess: (newMessage) => {
          // Append the sent message immediately (optimistic); pusher may also deliver it
          setLocalMessages((prev) => {
            const alreadyExists = prev.some((m) => m.id === newMessage.id);
            if (alreadyExists) return prev;
            return [...prev, newMessage];
          });
        },
        onError: () => {
          // Restore message text on error so user can retry
          setMessageText(text);
        },
      },
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  const ownerInfo: OwnerInfo = owner || {
    name: "...",
    location: "...",
    image: "/images/state.png",
  };

  const isLoading = startChatMutation.isPending || isMessagesLoading;

  if (!ownerId) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border">
        {t("no_owner_info")}
      </div>
    );
  }

  // Viewer is the owner of this property — cannot chat with yourself
  if (isOwnProperty) {
    return (
      <div className="rounded-xl border overflow-hidden bg-white shadow-sm">
        <div className="bg-main-green text-white text-center py-4">
          <h3 className="font-bold">{t("owner_details")}</h3>
        </div>
        <div className="p-8 text-center space-y-2">
          <div className="text-4xl">🏠</div>
          <p className="font-bold text-main-navy">
            {t("own_property_title") || "هذا إعلانك"}
          </p>
          <p className="text-sm text-gray-500">
            {t("own_property_desc") || "لا يمكنك إجراء محادثة مع نفسك"}
          </p>
        </div>
      </div>
    );
  }

  // Error state — User id invalid or other API error
  if (startChatMutation.isError) {
    return (
      <div className="rounded-xl border border-red-100 overflow-hidden bg-white shadow-sm">
        <div className="bg-red-500 text-white text-center py-4">
          <h3 className="font-bold">{t("owner_details")}</h3>
        </div>
        <div className="p-8 text-center space-y-3">
          <div className="text-4xl text-red-500">⚠️</div>
          <p className="font-bold text-main-navy">
            {t("chat_unavailable") || "المحادثة غير متاحة"}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {startChatMutation.error?.message ||
              "القيمة المحددة للمستخدم غير صالحة"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-white shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-main-green text-white text-center py-4 shrink-0">
        <h3 className="font-bold">{t("owner_details")}</h3>
      </div>

      {/* Owner Info */}
      <div className="p-4 border-b flex items-center justify-between gap-4 shrink-0">
        <Link
          href={`/profile/${ownerId}`}
          className="bg-main-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-main-green/90 transition-colors"
        >
          {t("view_profile")}
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h4 className="font-bold text-main-navy">{ownerInfo.name}</h4>
            <p className="text-xs text-gray-500">{ownerInfo.location}</p>
          </div>
          <div className="size-14 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={ownerInfo.image || "/images/state.png"}
              alt={ownerInfo.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-main-green h-8 w-8" />
          </div>
        ) : (
          <>
            {/* Chat open indicator */}
            <div className="text-center">
              <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <span className="size-2 rounded-full bg-main-green inline-block"></span>
                {t("open_chat")}
              </span>
            </div>

            {/* Empty state */}
            {localMessages.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">
                {t("no_messages")}
              </div>
            )}

            {/* Messages */}
            {localMessages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div
                  className={`flex ${
                    msg.sender_id === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender_id === currentUserId
                        ? "bg-main-green text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-main-navy rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    {msg.image_url && (
                      <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden">
                        <Image
                          src={msg.image_url}
                          alt="Message image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <p
                  className={`text-[10px] text-gray-400 ${
                    msg.sender_id === currentUserId ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white shrink-0">
        {!currentUserId ? (
          <div className="text-center py-2">
            <Link
              href="/auth/login"
              className="text-main-green font-bold hover:underline"
            >
              {t("login_to_chat")}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={
                  sendMessageMutation.isPending ||
                  !messageText.trim() ||
                  !chatId
                }
                className="size-10 rounded-full bg-main-green text-white flex items-center justify-center hover:bg-main-green/90 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <IoSend className="size-5" />
                )}
              </button>
              <button
                className="size-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Attach file"
              >
                <HiOutlineDocumentText className="size-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder={t("write_message")}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-right px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-main-green text-sm"
              disabled={!chatId || sendMessageMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  );
}
