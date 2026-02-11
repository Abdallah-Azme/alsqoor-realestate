import BlogSection from "@/components/home/blog-section";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import Image from "next/image";
import React from "react";
import { getBlogById } from "@/lib/blog-actions";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const response = await getBlogById(id);
  const blog = response?.data?.data;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: blog?.metaTitle || blog?.title || t("blogs.title"),
    description:
      blog?.metaDescription ||
      blog?.description?.substring(0, 160) ||
      t("blogs.description"),
    openGraph: {
      images: blog?.image ? [blog.image] : [],
    },
  };
}

const SingleBlogPage = async ({ params }) => {
  const t = await getTranslations("breadcrumbs");
  const { id } = params; // This will actually contain the slug from the URL

  // Fetch blog data using the slug (passed as id parameter)
  const response = await getBlogById(id);

  // If blog not found, show 404
  if (!response?.success || !response?.data?.data) {
    notFound();
  }

  const blog = response.data.data;

  return (
    <main className="space-y-12">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs
          items={[{ label: t("blogs"), href: "/blogs" }, { label: blog.title }]}
        />
        <h1 className="text-main-navy text-2xl font-bold">{blog.title}</h1>
      </div>
      <div className="container space-y-4 border border-gray-200 rounded-s-xl overflow-hidden">
        <div className="relative">
          <Image
            src={blog.image || "/images/state.png"}
            alt={blog.metaTitle || blog.title}
            width={1200}
            height={400}
            className="w-full h-96 object-cover"
          />
          {/* Author */}
          {blog.author && (
            <div className="bg-white border border-gray-200 rounded-xl lg:w-[25%] lg:absolute lg:-bottom-20 lg:left-10 z-10">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-main-navy font-bold text-center">Author</h3>
              </div>
              <div className="flex items-center gap-2 p-4">
                {blog.authorImage ? (
                  <Image
                    src={blog.authorImage}
                    alt={blog.author}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-main-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-main-green font-bold text-lg">
                      {blog.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-main-navy font-bold text-base">
                    {blog.author}
                  </h3>
                  {blog.categoryName && (
                    <p className="text-gray-500 text-xs">{blog.categoryName}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6 lg:p-14 p-8">
          {blog.description && (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          )}
        </div>
      </div>
      <BlogSection />
    </main>
  );
};

export default SingleBlogPage;
