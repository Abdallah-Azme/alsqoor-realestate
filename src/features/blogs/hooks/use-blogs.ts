"use client";

import { useQuery } from "@tanstack/react-query";
import { blogsService } from "../services/blogs.service";

/**
 * Hook to fetch paginated blogs
 */
export function useBlogs(page = 1, perPage = 12) {
  return useQuery({
    queryKey: ["blogs", page, perPage],
    queryFn: () => blogsService.getAll({ page, per_page: perPage }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single blog by ID
 */
export function useBlog(id: string | number) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogsService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
