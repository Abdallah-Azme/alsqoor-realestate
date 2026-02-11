import { z } from "zod";

// Packages are read-only from API
// This file contains validation schemas for package subscription if needed

export const packageSubscriptionSchema = z.object({
  packageId: z.number().min(1, "Package is required"),
  paymentMethod: z.enum(["cash", "points"]),
});

export type PackageSubscriptionData = z.infer<typeof packageSubscriptionSchema>;
