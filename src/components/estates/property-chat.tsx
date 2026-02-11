"use client";

import Image from "next/image";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "owner";
  timestamp: string;
  date?: string;
}

interface OwnerInfo {
  name: string;
  location: string;
  image: string;
}

interface PropertyChatProps {
  owner?: OwnerInfo;
  propertyId?: number | string;
}

export default function PropertyChat({ owner, propertyId }: PropertyChatProps) {
  const t = useTranslations("property_chat");
  const [message, setMessage] = useState("");

  // Static demo data
  const ownerInfo: OwnerInfo = owner || {
    name: "مازن أسعد",
    location: "جدة، حي النسيم",
    image: "/images/saman.jpg",
  };

  const staticMessages: ChatMessage[] = [
    {
      id: 1,
      content: "السلام عليكم...أريد إتمام شراء العقار ماهو المطلوب؟",
      sender: "user",
      timestamp: "12:35 AM",
      date: "أمس",
    },
    {
      id: 2,
      content: "هذا رقمي الخاص يرجى التواصل عليه\n0102255554",
      sender: "owner",
      timestamp: "12:55 AM",
      date: "اليوم",
    },
    {
      id: 3,
      content: "شكرا جزيلا",
      sender: "user",
      timestamp: "",
    },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    // For now, just clear the input (static implementation)
    setMessage("");
  };

  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="bg-main-green text-white text-center py-4">
        <h3 className="font-bold">{t("owner_details")}</h3>
      </div>

      {/* Owner Info */}
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <Link
          href={`/profile/${propertyId || "owner"}`}
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
            {ownerInfo.image ? (
              <Image
                src={ownerInfo.image}
                alt={ownerInfo.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-main-green/20 text-main-green font-bold text-xl">
                {ownerInfo.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50">
        {/* Open Chat Label */}
        <div className="text-center">
          <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <span className="size-2 rounded-full bg-main-green"></span>
            {t("open_chat")}
          </span>
        </div>

        {/* Messages */}
        {staticMessages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div
              className={`flex ${
                msg.sender === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-main-green text-white rounded-tl-none"
                    : "bg-white border border-gray-200 text-main-navy rounded-tr-none"
                }`}
              >
                {msg.sender === "owner" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-full overflow-hidden bg-gray-200">
                      {ownerInfo.image ? (
                        <Image
                          src={ownerInfo.image}
                          alt={ownerInfo.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-main-green/20 text-main-green font-bold text-sm">
                          {ownerInfo.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
            {(msg.timestamp || msg.date) && (
              <p
                className={`text-xs text-gray-400 ${
                  msg.sender === "user" ? "text-left" : "text-right"
                }`}
              >
                {msg.date && <span>{msg.date} - </span>}
                {msg.timestamp}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-full bg-main-green text-white flex items-center justify-center hover:bg-main-green/90 transition-colors">
              <IoSend className="size-5" />
            </button>
            <button className="size-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <HiOutlineDocumentText className="size-5" />
            </button>
          </div>
          <input
            type="text"
            placeholder={t("write_message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-right px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-main-green text-sm"
          />
        </div>
      </div>
    </div>
  );
}
