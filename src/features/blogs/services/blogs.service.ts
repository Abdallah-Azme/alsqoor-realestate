import { api } from "@/lib/api-client";
import { Blog } from "../types/blog.types";

const BASE_PATH = "/blogs";

/**
 * Blogs service - functions for blog API operations
 */
export const blogsService = {
  /**
   * Get all blogs with optional pagination
   */
  async getAll(params?: { page?: number; per_page?: number }) {
    return api.get<Blog[]>(BASE_PATH, params);
  },

  /**
   * Get a single blog by ID/slug
   */
  async getById(id: string | number) {
    return api.get<Blog>(`${BASE_PATH}/${id}`);
  },

  /**
   * Search blogs
   */
  async search(term: string) {
    return api.get<Blog[]>(`${BASE_PATH}/search`, { search: term });
  },

  /**
   * Get similar blogs
   */
  async getSimilar(id: string | number) {
    return api.get<Blog[]>(`${BASE_PATH}/${id}/similar`);
  },

  /**
   * Get categories with blogs
   */
  async getCategoriesWithBlogs() {
    return api.get<any[]>("/category-with-blogs");
  },

  /**
   * Get blogs by category
   */
  async getByCategory(categoryId: string | number) {
    return api.get<any>(`/category/${categoryId}`);
  },
};
