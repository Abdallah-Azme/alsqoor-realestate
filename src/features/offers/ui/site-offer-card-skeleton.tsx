import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function SiteOfferCardSkeleton() {
  return (
    <Card className="relative h-full overflow-hidden border-none shadow-sm flex flex-col bg-white">
      <div className="absolute top-4 right-4 z-10">
        <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
      </div>

      <CardHeader className="space-y-4 pb-0 pt-8 relative z-10">
        <div className="h-8 w-[85%] animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 grow relative z-10">
        <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-2">
            <div className="h-14 w-28 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-5 w-10 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-7 w-36 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <ul className="grid grid-cols-1 gap-2.5">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100"
              >
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 pb-8 relative z-10 border-t border-gray-50">
        <div className="flex items-center gap-3 w-full bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-gray-200" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-200" />
      </CardFooter>
    </Card>
  );
}
