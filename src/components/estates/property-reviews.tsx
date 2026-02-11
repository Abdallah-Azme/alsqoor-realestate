"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ClientCard from "@/components/shared/client-card";

export default function PropertyReviews({ reviews, locale }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">لا توجد تقييمات بعد</div>
    );
  }

  return (
    <Carousel
      className={"space-y-8"}
      opts={{
        loop: true,
        direction: locale === "ar" ? "rtl" : "ltr",
        align: "start",
      }}
    >
      <CarouselContent className={"lg:w-[98%] ms-auto max-lg:container"}>
        {reviews.map((review, index) => (
          <CarouselItem key={review.id || index} className="basis-[95%]">
            <ClientCard review={review} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-center gap-3 flex-row-reverse">
        <CarouselPrevious className={"static translate-0"} />
        <CarouselNext className={"static translate-0"} />
      </div>
    </Carousel>
  );
}
