"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintsService } from "../services/complaints.service";
import { Complaint, ComplaintType } from "../types/complaint.types";

/**
 * Hook to fetch complaint types
 */
export function useComplaintTypes() {
  return useQuery({
    queryKey: ["complaint-types"],
    queryFn: () => complaintsService.getComplaintTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to submit a complaint
 */
export function useSubmitComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Complaint, "id">) =>
      complaintsService.submitComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}
