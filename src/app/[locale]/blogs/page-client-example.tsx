"use client";

import React from "react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { BlogCard } from "@/features/blogs";
import { useBlogs } from "@/features/blogs";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/animated-section";
import { AnimatedItem } from "@/components/motion/animated-section";

export default function BlogsPageClient({
  initialPage = 1,
}: {
  initialPage?: number;
}) {
  const t = useTranslations("breadcrumbs");
  const [page, setPage] = React.useState(initialPage);

  // Use the new React Query hook
  const { data: paginatedData, isLoading, error } = useBlogs(page, 12);

  const blogs = paginatedData?.data || [];
  const pagination = paginatedData;

  if (isLoading) {
    return (
      <main className="space-y-12">
        <div className="container">
          <div className="text-center py-12">Loading blogs...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-12">
        <div className="container">
          <div className="text-center py-12 text-red-500">
            Error loading blogs. Please try again.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-12">
      <AnimatedSection>
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs items={[{ label: t("blogs") }]} />
          <h1 className="text-main-navy text-2xl font-bold">{t("blogs")}</h1>
        </div>
      </AnimatedSection>
      <div className="container space-y-8">
        {/* Blog Grid */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <AnimatedItem key={blog.id} index={index}>
                  <BlogCard item={blog} />
                </AnimatedItem>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No blogs available
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <AnimatedSection delay={0.3}>
            <div className="flex justify-center items-center gap-4">
              {pagination.current_page > 1 && (
                <button
                  onClick={() => setPage(pagination.current_page - 1)}
                  className="px-4 py-2 bg-main-navy text-white rounded-lg hover:bg-main-navy/80 transition-colors"
                >
                  Previous
                </button>
              )}

              <span className="text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              {pagination.current_page < pagination.last_page && (
                <button
                  onClick={() => setPage(pagination.current_page + 1)}
                  className="px-4 py-2 bg-main-navy text-white rounded-lg hover:bg-main-navy/80 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}
