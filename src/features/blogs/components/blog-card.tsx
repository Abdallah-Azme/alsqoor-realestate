import Image from "next/image";
import Link from "next/link";
import { Blog } from "../types/blog.types";

interface BlogCardProps {
  item: Blog;
}

export default function BlogCard({ item }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${item.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {item.image && (
        <div className="relative h-48 w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-main-navy mb-2 line-clamp-2">
          {item.title}
        </h3>
        {item.created_at && (
          <p className="text-sm text-gray-500">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
