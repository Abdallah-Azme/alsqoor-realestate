"use client";

import { useMutation } from "@tanstack/react-query";
import { newsletterService } from "../services/newsletter.service";

/**
 * Hook to subscribe to newsletter
 */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) => newsletterService.subscribe(email),
  });
}
