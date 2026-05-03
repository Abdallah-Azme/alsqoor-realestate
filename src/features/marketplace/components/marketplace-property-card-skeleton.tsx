import { Card, CardContent } from "@/components/ui/card";

export function MarketplacePropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 py-0 border-gray-100 h-full flex flex-col">
      <div className="relative h-48 w-full shrink-0 animate-pulse bg-gray-200" />
      <CardContent className="p-4 flex flex-1 flex-col gap-3">
        <div className="h-5 animate-pulse rounded-md bg-gray-200 w-4/5" />
        <div className="space-y-2">
          <div className="h-3 animate-pulse rounded bg-gray-200 w-full" />
          <div className="h-3 animate-pulse rounded bg-gray-200 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-4 animate-pulse rounded bg-gray-200 w-14" />
          <div className="h-4 animate-pulse rounded bg-gray-200 w-20" />
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="h-6 animate-pulse rounded bg-gray-200 w-28" />
          <div className="h-6 animate-pulse rounded bg-gray-200 w-16 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
