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
import { chatService } from "@/features/chat/services/chat.service";
import { getPusherClient } from "@/lib/pusher";
import { api } from "@/lib/api-client";
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
  const [chatStartAttempts, setChatStartAttempts] = useState(0);
  const [chatErrorMessage, setChatErrorMessage] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const extractUserId = (rawUser: any): number | null => {
    const candidate =
      rawUser?.id ??
      rawUser?.user?.id ??
      rawUser?.data?.id ??
      rawUser?.profile?.id;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const extractChatId = (raw: any): number | null => {
    const candidate =
      raw?.id ??
      raw?.chatId ??
      raw?.chat_id ??
      raw?.chat?.id ??
      raw?.chat?.chatId ??
      raw?.data?.id ??
      raw?.data?.chatId ??
      raw?.data?.chat_id ??
      raw?.data?.chat?.id ??
      raw?.data?.chat?.chatId;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const getMessageTimeLabel = (msg: any): string => {
    const rawDate =
      msg?.created_at ??
      msg?.createdAt ??
      msg?.timestamp ??
      msg?.sent_at ??
      msg?.sentAt;

    if (!rawDate) return "";

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const resolveChatIdFromMyChats = async (): Promise<number | null> => {
    if (!ownerId) return null;
    try {
      const chats = await chatService.getMyChats();
      const numericPropertyId = Number(propertyId);
      const hasValidPropertyId =
        Number.isFinite(numericPropertyId) && numericPropertyId > 0;

      const matchesOwner = (chat: any) =>
        Number(chat?.other_user?.id) === Number(ownerId) ||
        Number(chat?.other_user_id) === Number(ownerId) ||
        Number(chat?.user?.id) === Number(ownerId) ||
        Number(chat?.otherUser?.id) === Number(ownerId);

      const matchesProperty = (chat: any) => {
        if (!hasValidPropertyId) return true;
        return (
          Number(chat?.property_id) === numericPropertyId ||
          Number(chat?.propertyId) === numericPropertyId ||
          Number(chat?.property?.id) === numericPropertyId ||
          Number(chat?.property_new_id) === numericPropertyId ||
          Number(chat?.propertyNewId) === numericPropertyId ||
          Number(chat?.last_message?.property_id) === numericPropertyId ||
          Number(chat?.last_message?.propertyId) === numericPropertyId
        );
      };

      // Prefer exact owner+property match first, then fall back to owner-only.
      const matchedChat =
        chats.find((chat: any) => matchesOwner(chat) && matchesProperty(chat)) ||
        chats.find((chat: any) => matchesOwner(chat));

      return extractChatId(matchedChat);
    } catch {
      return null;
    }
  };

  // Get current user ID from localStorage
  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const idFromStorage = extractUserId(user);
          if (idFromStorage) {
            setCurrentUserId(idFromStorage);
            return;
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }

      // Fallback: resolve from profile endpoint when localStorage shape is unexpected
      const token = localStorage.getItem("token");
      if (token) {
        api
          .get<any>("/profile")
          .then((profile) => {
            if (!isMounted) return;
            const idFromProfile = extractUserId(profile?.data || profile);
            if (idFromProfile) {
              setCurrentUserId(idFromProfile);
            }
          })
          .catch(() => {
            // Keep null when unauthenticated or profile fails
          });
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Start/Get Chat once ownerId and currentUserId are known
  const startChatMutation = useStartChat();

  // Don't attempt to start a chat if the viewer IS the owner
  const isOwnProperty =
    ownerId && currentUserId && Number(ownerId) === currentUserId;

  useEffect(() => {
    if (isOwnProperty) return; // no self-chat
    if (ownerId && currentUserId && !chatStarted && chatStartAttempts < 2) {
      setChatStarted(true);
      setChatStartAttempts((prev) => prev + 1);
      startChatMutation.mutate(
        {
          other_user_id: Number(ownerId),
          property_id: propertyId ? Number(propertyId) : undefined,
        },
        {
          onSuccess: (data: any) => {
            const resolvedChatId = extractChatId(data);
            if (resolvedChatId) {
              setChatErrorMessage(null);
              setChatId(resolvedChatId);
            } else {
              resolveChatIdFromMyChats().then((fallbackChatId) => {
                if (fallbackChatId) {
                  setChatErrorMessage(null);
                  setChatId(fallbackChatId);
                } else {
                  setChatErrorMessage(
                    "تعذر فتح المحادثة: صيغة استجابة غير متوقعة من الخادم",
                  );
                  setChatStarted(false);
                }
              });
            }
          },
          onError: (err: any) => {
            console.error("Failed to start chat", err);
            // Allow one safe retry in case the first attempt fails transiently.
            setChatErrorMessage(err?.message || "تعذر فتح المحادثة");
            setChatStarted(false);
          },
        },
      );
    }
  }, [
    ownerId,
    currentUserId,
    chatStarted,
    isOwnProperty,
    chatStartAttempts,
    propertyId,
    startChatMutation,
  ]);

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
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `private-chat.${chatId}`;
    const channel = pusher.subscribe(channelName);

    const onIncomingMessage = (payload: {
      message?: ChatMessage;
      data?: ChatMessage;
    }) => {
      const message = payload?.message ?? payload?.data;
      if (!message) return;

      setLocalMessages((prev) => {
        const alreadyExists = prev.some((m) => m.id === message.id);
        if (alreadyExists) return prev;
        return [...prev, message];
      });
      markAsReadMutation.mutate(chatId);
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
  }, [chatId, markAsReadMutation]);

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
            {t("own_property_desc") ||
              "يستطيع العملاء بدء المحادثة معك من صفحة الإعلان، وستظهر رسائلهم هنا وفي الإشعارات."}
          </p>
          <div className="pt-2">
            <Link
              href="/chats"
              className="inline-flex items-center justify-center rounded-md bg-main-green px-4 py-2 text-sm font-bold text-white hover:bg-main-green/90 transition-colors"
            >
              {t("go_to_messages") || "عرض الرسائل والإشعارات"}
            </Link>
          </div>
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
            {localMessages.map((msg) => {
              const isMine =
                currentUserId !== null &&
                getMessageSenderId(msg) === Number(currentUserId);
              return (
              <div key={msg.id} className="space-y-1">
                <div
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      isMine
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
                    isMine ? "text-right" : "text-left"
                  }`}
                >
                  {getMessageTimeLabel(msg)}
                </p>
              </div>
            )})}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white shrink-0">
        {chatErrorMessage && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {chatErrorMessage}
          </div>
        )}
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
