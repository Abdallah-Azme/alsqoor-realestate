"use server";

/**
 * Blog Actions - Migrated to use CrudBase
 *
 * This file demonstrates the new pattern using the CRUD base class.
 * Compare this with the old implementation to see the benefits.
 *
 * Old version had ~31 lines with repetitive getData calls.
 * New version has ~40 lines but includes full CRUD operations (create, update, delete).
 */

import { CrudBase } from "./crud-base";
import { Blog, ApiResponse, PaginatedResponse } from "@/types";

// Create a singleton service instance
const blogsService = new CrudBase<Blog>("/blogs");

/**
 * Fetch all blogs with pagination
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 6)
 * @returns Response with blogs data and pagination
 */
export async function getBlogs(
  page = 1,
  perPage = 6,
): Promise<ApiResponse<PaginatedResponse<Blog>>> {
  return (await blogsService.getAll({
    page,
    per_page: perPage,
  })) as ApiResponse<PaginatedResponse<Blog>>;
}

/**
 * Fetch a single blog by ID
 * @param id - Blog ID
 * @returns Response with blog data
 */
export async function getBlogById(
  id: number | string,
): Promise<ApiResponse<Blog>> {
  return await blogsService.getById(id);
}

/**
 * Create a new blog
 * @param data - Blog data
 * @returns Response with created blog
 */
export async function createBlog(
  data: Partial<Blog>,
): Promise<ApiResponse<Blog>> {
  return await blogsService.create(data);
}

/**
 * Update an existing blog
 * @param id - Blog ID
 * @param data - Updated blog data
 * @returns Response with updated blog
 */
export async function updateBlog(
  id: number | string,
  data: Partial<Blog>,
): Promise<ApiResponse<Blog>> {
  return await blogsService.update(id, data);
}

/**
 * Delete a blog
 * @param id - Blog ID
 * @returns Response confirming deletion
 */
export async function deleteBlog(
  id: number | string,
): Promise<ApiResponse<Blog>> {
  return await blogsService.delete(id);
}

/**
 * Example: Get featured blogs (custom endpoint)
 * This would call GET /blogs/featured
 */
/**
 * Search blogs
 * @param term - Search term
 * @returns Response with matching blogs
 */
export async function searchBlogs(
  term: string,
): Promise<ApiResponse<PaginatedResponse<Blog>>> {
  return await blogsService.custom<PaginatedResponse<Blog>>("/search", "GET", {
    queryParams: { search: term },
  });
}

/**
 * Get similar blogs
 * @param id - Blog ID or slug
 * @returns Response with similar blogs
 */
export async function getSimilarBlogs(
  id: number | string,
): Promise<ApiResponse<Blog[]>> {
  return await blogsService.custom<Blog[]>(`/${id}/similar`, "GET");
}

/**
 * Get categories with blogs
 * @returns Response with categories and their blogs
 */
export async function getCategoriesWithBlogs(): Promise<ApiResponse<any[]>> {
  // This endpoint is at the root level, not under /blogs
  // We'll use the getData utility directly
  const { getData } = await import("./fetch-methods");
  return await getData<any[]>({ url: "/category-with-blogs" });
}

/**
 * Get blogs by category
 * @param categoryId - Category ID
 * @returns Response with blogs in the category
 */
export async function getBlogsByCategory(
  categoryId: number | string,
): Promise<ApiResponse<any>> {
  // This endpoint is at the root level, not under /blogs
  const { getData } = await import("./fetch-methods");
  return await getData<any>({ url: `/category/${categoryId}` });
}
