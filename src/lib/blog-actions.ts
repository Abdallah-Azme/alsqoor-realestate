"use server";

import { getData } from "./fetch-methods";
import { ApiResponse, Blog, PaginatedResponse } from "@/types";

/**
 * Fetch all blogs with pagination
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 6)
 * @returns Response with blogs data and pagination
 */
export async function getBlogs(
  page = 1,
  perPage = 6
): Promise<ApiResponse<PaginatedResponse<Blog>>> {
  const url = `/blogs?page=${page}&per_page=${perPage}`;
  return await getData<PaginatedResponse<Blog>>({ url });
}

/**
 * Fetch a single blog by ID
 * @param id - Blog ID
 * @returns Response with blog data
 */
export async function getBlogById(
  id: number | string
): Promise<ApiResponse<Blog>> {
  const url = `/blogs/${id}`;
  return await getData<Blog>({ url });
}
