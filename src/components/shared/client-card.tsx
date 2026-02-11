import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

interface Testimonial {
  name: string;
  comment: string;
  image?: string;
  rating: string | number;
}

interface ClientCardProps {
  item: Testimonial;
}

const ClientCard = ({ item }: ClientCardProps) => {
  const reviewerName = item?.name || "مستخدم";
  const rating = parseFloat(String(item?.rating)) || 0;
  const image = item?.image;

  return (
    <div className="border-2 border-gray-200 rounded-s-2xl p-6 space-y-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={47}
        height={47}
        viewBox="0 0 24 24"
        fill="none"
        className="ms-auto"
      >
        <g clipPath="url(#clip0_4418_9113)">
          <path
            d="M2 12.3506H7.79999C9.32999 12.3506 10.38 13.5106 10.38 14.9306V18.1506C10.38 19.5706 9.32999 20.7306 7.79999 20.7306H4.58002C3.16002 20.7306 2 19.5706 2 18.1506V12.3506"
            stroke="#3fb38b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12.3502C2 6.30022 3.13003 5.30027 6.53003 3.28027"
            stroke="#3fb38b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.63 12.3506H19.43C20.96 12.3506 22.01 13.5106 22.01 14.9306V18.1506C22.01 19.5706 20.96 20.7306 19.43 20.7306H16.21C14.79 20.7306 13.63 19.5706 13.63 18.1506V12.3506"
            stroke="#3fb38b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.63 12.3502C13.63 6.30022 14.76 5.30027 18.16 3.28027"
            stroke="#3fb38b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4418_9113">
            <rect width={24} height={24} fill="white" />
          </clipPath>
        </defs>
      </svg>
      {/* content */}
      <div className="space-y-6">
        <div
          className="font-light leading-8"
          dangerouslySetInnerHTML={{ __html: item?.comment || "" }}
        />
      </div>
      {/* author */}
      <div className="flex items-center gap-2">
        {image ? (
          <Image
            src={image}
            alt={reviewerName}
            width={48}
            height={48}
            className="size-12 rounded-md object-cover"
          />
        ) : (
          <div className="size-12 rounded-md bg-main-green/20 flex items-center justify-center text-main-green font-bold text-lg">
            {reviewerName?.charAt(0)?.toUpperCase()}
          </div>
        )}
        <div className="space-y-1 text-xs">
          <h3 className="font-bold">{reviewerName}</h3>
          <p className="text-gray-400 flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {rating.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
