import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React from "react";
import { MdArrowForwardIos } from "react-icons/md";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";
const BlogCard = ({ item }) => {
  return (
    <article className="border-2 border-gray-200 rounded-s-2xl overflow-hidden">
      <figure>
        <Image
          src={item?.image}
          alt={item?.metaTitle}
          width={300}
          height={300}
          className="w-full h-60 object-cover"
        />
      </figure>
      <figcaption className="p-4 space-y-8">
        {/* title */}
        <h4 className=" font-semibold">{item?.title}</h4>
        <div className="text-xs line-clamp-2 text-gray-500 leading-6">
          <Markdown rehypePlugins={[rehypeRaw]}>{item?.description}</Markdown>
        </div>
        <Link
          href={`/blogs/${item?.slug || item?.id}`}
          className="block w-fit rounded-full  py-2 px-3 border-1 border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300"
        >
          <MdArrowForwardIos size={14} />
        </Link>
      </figcaption>
    </article>
  );
};

export default BlogCard;
