import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import FeaturedUserCard from "@/components/shared/featured-user-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { featuredUsersService } from "@/features/featured-users";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/motion/animated-section";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("featuredUsers.title"),
    description: t("featuredUsers.description"),
  };
}

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const FeaturedUsersPage = async ({ searchParams }: PageProps) => {
  const t = await getTranslations("featured_users");
  const tBreadcrumbs = await getTranslations("breadcrumbs");

  // Get current page from search params, default to 1
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const searchQuery = searchParams?.search || "";

  // Fetch featured users data
  const featuredUsers = await featuredUsersService.getAll({
    page: currentPage,
    per_page: 12,
    search: searchQuery || undefined,
  });

  // For pagination
  const meta = {
    current_page: currentPage,
    last_page: Math.ceil(featuredUsers.length / 12) || 1,
    per_page: 12,
    total: featuredUsers.length,
  };

  return (
    <main className="space-y-8">
      <AnimatedSection>
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs
            items={[{ label: tBreadcrumbs("featured_users") }]}
          />
          <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
        </div>
      </AnimatedSection>

      <div className="container space-y-8">
        {/* Search Input */}
        <AnimatedSection delay={0.1}>
          <div className="flex items-center gap-2 max-w-xs">
            <form action="" method="get" className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-main-green" />
              <Input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder={t("search_placeholder")}
                className="ps-10 bg-white border-gray-200 focus:border-main-green"
              />
            </form>
          </div>
        </AnimatedSection>

        {/* Cards Grid */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUsers.length > 0 ? (
              featuredUsers.map((user, index) => (
                <AnimatedItem key={user.id} index={index}>
                  <FeaturedUserCard item={user} />
                </AnimatedItem>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-12">
                {t("no_users")}
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <AnimatedSection delay={0.3}>
            <div className="flex items-center justify-center gap-2 mt-8">
              {/* Previous Button */}
              {meta.current_page > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 p-0"
                  asChild
                >
                  <a
                    href={`?page=${meta.current_page - 1}${
                      searchQuery ? `&search=${searchQuery}` : ""
                    }`}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    className={`size-8 p-0 bg-white text-black border border-gray-300 hover:bg-gray-100 ${
                      page === meta.current_page ? "border-main-green" : ""
                    }`}
                    asChild
                  >
                    <a
                      href={`?page=${page}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                    >
                      {page}
                    </a>
                  </Button>
                ),
              )}

              {/* Next Button */}
              {meta.current_page < meta.last_page && (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 p-0"
                  asChild
                >
                  <a
                    href={`?page=${meta.current_page + 1}${
                      searchQuery ? `&search=${searchQuery}` : ""
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
};

export default FeaturedUsersPage;
