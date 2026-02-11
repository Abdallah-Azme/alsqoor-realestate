import { z } from "zod";

export const complaintSchema = z.object({
  type_id: z.number().min(1, "Please select a complaint type"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
