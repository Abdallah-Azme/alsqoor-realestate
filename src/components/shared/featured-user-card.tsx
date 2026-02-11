import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, Mail, Phone, Star } from "lucide-react";
import { FeaturedUser } from "@/features/featured-users";

interface FeaturedUserCardProps {
  user: FeaturedUser;
}

const FeaturedUserCard = ({ user }: FeaturedUserCardProps) => {
  return (
    <Link
      href={`/partners/${user?.id}`}
      className="group block relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-main-green/30"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-main-green/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 space-y-5">
        {/* Header with avatar and info */}
        <div className="flex items-start gap-4">
          {/* Avatar with gradient border */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-main-green to-emerald-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-white p-1 rounded-full shadow-sm">
              <Image
                src={user?.avatarUrl || "/placeholder-avatar.png"}
                alt={user?.name || "user"}
                width={60}
                height={60}
                className="w-14 h-14 object-cover rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div className="flex-1 space-y-1.5">
            <h3 className="font-bold text-base text-gray-900 group-hover:text-main-green transition-colors duration-300 line-clamp-1">
              {user?.name}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-main-green/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-main-green animate-pulse" />
              <p className="text-main-green text-xs font-medium capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          {/* Arrow icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-main-green flex items-center justify-center transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Mail className="w-4 h-4 text-main-green" />
            </div>
            <p className="text-sm line-clamp-1">{user?.email}</p>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Phone className="w-4 h-4 text-main-green" />
            </div>
            <p className="text-sm line-clamp-1">{user?.mobile}</p>
          </div>
        </div>

        {/* Points Badge */}
        {user?.pointsBalance > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {user?.pointsBalance} Points
            </span>
          </div>
        )}

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-main-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
};

export default FeaturedUserCard;
