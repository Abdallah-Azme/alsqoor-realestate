"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}

export default function HomeSkeleton() {
  return (
    <div className="w-full space-y-20 pb-20 overflow-hidden">
      {/* Hero Section Skeleton */}
      <section className="relative h-[600px] md:h-[800px] w-full bg-gray-100 flex items-center justify-center">
        <div className="container relative z-10 flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-4 w-32 md:w-48 bg-main-green/20" />
          <Skeleton className="h-12 md:h-20 w-3/4 md:w-2/3 rounded-2xl" />
          <Skeleton className="h-6 md:h-8 w-1/2 md:w-1/3 opacity-70" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-14 w-40 md:w-48 rounded-xl" />
            <Skeleton className="h-14 w-40 md:w-48 rounded-xl bg-main-green/10" />
          </div>
        </div>
        {/* Abstract shapes to mimic hero background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-200/50 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gray-200/30 rounded-tr-full" />
      </section>

      {/* Services Section Skeleton */}
      <section className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-8 rounded-[32px] border border-gray-100 bg-white space-y-4">
              <Skeleton className="h-16 w-16 rounded-2xl bg-main-green/10" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square lg:aspect-video rounded-[40px] overflow-hidden">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-4 w-24 bg-main-green/20" />
          <Skeleton className="h-10 md:h-12 w-4/5" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-14 w-44 rounded-xl mt-8" />
        </div>
      </section>

      {/* Properties Filter Section Skeleton */}
      <section className="container space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4 w-full md:w-auto">
            <Skeleton className="h-4 w-32 bg-main-green/20" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl" />
            ))}
          </div>
        </div>
        
        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-[32px] overflow-hidden border border-gray-100 bg-white space-y-4 pb-6">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="px-6 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/4 bg-main-green/10" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews & Blog Teaser */}
      <section className="bg-main-light-gray/50 py-20">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Skeleton className="h-10 w-64" />
            <div className="bg-white p-8 rounded-[40px] shadow-sm space-y-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden space-y-3 pb-4 shadow-sm">
                  <Skeleton className="aspect-video w-full" />
                  <div className="px-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
