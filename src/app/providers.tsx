// In Next.js, this file would be called: app/providers.tsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Allow individual queries to skip the global error toast
        if (query.meta?.skipGlobalError) return;
        // Skip toast for 401 — handled by redirect/logout logic
        if (error instanceof ApiError && error.unauthorized) return;

        const message =
          error instanceof ApiError
            ? error.message
            : error?.message || "حدث خطأ غير متوقع";

        // Skip showing "Unauthenticated." message
        if (message === "Unauthenticated.") return;

        toast.error(message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // Allow individual mutations to skip the global error toast
        if (mutation.meta?.skipGlobalError) return;
        // Skip toast for 401
        if (error instanceof ApiError && error.unauthorized) return;

        const message =
          error instanceof ApiError
            ? error.message
            : error?.message || "حدث خطأ غير متوقع";

        // Skip showing "Unauthenticated." message
        if (message === "Unauthenticated.") return;

        toast.error(message);
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on 401 or 403
          if (
            error instanceof ApiError &&
            (error.code === 401 || error.code === 403)
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale } from "next-intl";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </QueryClientProvider>
  );
}
