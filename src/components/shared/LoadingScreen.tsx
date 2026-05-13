import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const shellSizes = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
};

const previewHeights = {
  sm: "h-36",
  md: "h-44",
  lg: "h-56",
};

const rowCounts = {
  sm: 2,
  md: 3,
  lg: 4,
};

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-full bg-gray-200", className)} />
  );
}

export default function LoadingScreen({
  message = "جاري التحميل...",
  size = "md",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white/75 p-4 backdrop-blur-md"
    : "flex items-center justify-center py-12";

  return (
    <div
      className={containerClasses}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className={cn(
          "w-full rounded-4xl border border-gray-100 bg-white/90 p-4 shadow-2xl shadow-main-navy/10 sm:p-6",
          shellSizes[size],
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <SkeletonLine className="h-3 w-24 bg-main-green/20" />
            <SkeletonLine className="h-7 w-2/3 rounded-xl" />
          </div>
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-main-green/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-4">
            <div
              className={cn(
                "animate-pulse rounded-3xl bg-linear-to-br from-gray-200 via-gray-100 to-main-light-green/30",
                previewHeights[size],
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50/80 p-3"
                >
                  <SkeletonLine className="h-3 w-3/4" />
                  <SkeletonLine className="h-5 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: rowCounts[size] }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine className="h-4 w-4/5 rounded-lg" />
                  <SkeletonLine className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p className="mt-5 text-center text-sm font-medium text-main-navy/70">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
