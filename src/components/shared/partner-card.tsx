import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { MapPin, ArrowRight } from "lucide-react";

const Partnercard = ({ item }) => {
  return (
    <div
      // href={`/partners/${item?.id}`}
      className="group block relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-main-green/30"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-main-green/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 space-y-5">
        {/* Header with logo and info */}
        <div className="flex items-start gap-4">
          {/* Logo with gradient border */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-main-green to-emerald-400 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-white p-2 rounded-xl shadow-sm">
              <Image
                src={item?.logoUrl}
                alt={item?.name || "partner"}
                width={60}
                height={60}
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>

          {/* Company info */}
          <div className="flex-1 space-y-1.5">
            <h3 className="font-bold text-base text-gray-900 group-hover:text-main-green transition-colors duration-300 line-clamp-1">
              {item?.name}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-main-green/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-main-green animate-pulse" />
              <p className="text-main-green text-xs font-medium">
                {item?.type}
              </p>
            </div>
          </div>

          {/* Arrow icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-main-green flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-main-green" />
          </div>
          <p className="text-sm line-clamp-1">{item?.address}</p>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 leading-relaxed overflow-hidden line-clamp-3 prose prose-sm max-w-none">
          <Markdown rehypePlugins={[rehypeRaw]}>{item?.description}</Markdown>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-main-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default Partnercard;
