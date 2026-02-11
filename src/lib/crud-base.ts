/**
 * Generic CRUD Base Class
 * Provides common CRUD operations for any entity type
 *
 * @example
 * ```typescript
 * // Create a blogs service
 * const blogsService = new CrudBase<Blog>('/blogs');
 *
 * // Get all blogs with pagination
 * const blogs = await blogsService.getAll({ page: 1, per_page: 10 });
 *
 * // Get a single blog
 * const blog = await blogsService.getById(1);
 *
 * // Create a new blog
 * const newBlog = await blogsService.create({ title: 'New Blog', description: 'Content' });
 *
 * // Update a blog
 * const updated = await blogsService.update(1, { title: 'Updated Title' });
 *
 * // Delete a blog
 * await blogsService.delete(1);
 * ```
 */

import { getData, postData, putData, deleteData } from "./fetch-methods";
import { ApiResponse, PaginatedResponse } from "@/types";

export interface CrudOptions {
  locale?: string;
}

export interface GetAllOptions extends CrudOptions {
  page?: number;
  per_page?: number;
  [key: string]: any; // Allow additional query parameters
}

export class CrudBase<T> {
  private basePath: string;

  /**
   * Create a new CRUD service
   * @param basePath - The base API path (e.g., '/blogs', '/properties')
   */
  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return path;
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    return queryString ? `${path}?${queryString}` : path;
  }

  /**
   * Get all items with optional pagination and filtering
   * @param options - Query parameters including page, per_page, etc.
   * @returns Paginated response or array of items
   */
  async getAll(
    options?: GetAllOptions
  ): Promise<ApiResponse<PaginatedResponse<T> | T[]>> {
    const { locale, ...queryParams } = options || {};
    const url = this.buildUrl(this.basePath, queryParams);

    return await getData<PaginatedResponse<T> | T[]>({
      url,
      locale,
    });
  }

  /**
   * Get a single item by ID
   * @param id - Item ID
   * @param options - Optional locale settings
   * @returns Single item response
   */
  async getById(
    id: string | number,
    options?: CrudOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.basePath}/${id}`;
    return await getData<T>({
      url,
      locale: options?.locale,
    });
  }

  /**
   * Create a new item
   * @param data - Item data or FormData
   * @param isFormData - Whether the data is FormData (for file uploads)
   * @param options - Optional locale setting
   * @returns Created item response
   */
  async create(
    data: Record<string, any> | FormData,
    isFormData = false,
    options?: CrudOptions
  ): Promise<ApiResponse<T>> {
    const url = this.basePath;
    return await postData<T>({
      url,
      data: data as Record<string, any>,
      isFormData,
      locale: options?.locale,
    });
  }

  /**
   * Update an existing item
   * @param id - Item ID
   * @param data - Updated item data or FormData
   * @param isFormData - Whether the data is FormData (for file uploads)
   * @param options - Optional locale setting
   * @returns Updated item response
   */
  async update(
    id: string | number,
    data: Record<string, any> | FormData,
    isFormData = false,
    options?: CrudOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.basePath}/${id}`;
    return await putData<T>({
      url,
      data: data as Record<string, any>,
      isFormData,
      locale: options?.locale,
    });
  }

  /**
   * Delete an item
   * @param id - Item ID
   * @param options - Optional locale setting
   * @returns Delete response
   */
  async delete(
    id: string | number,
    options?: CrudOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.basePath}/${id}`;
    return await deleteData<T>({
      url,
      locale: options?.locale,
    });
  }

  /**
   * Custom endpoint call within the same base path
   * Useful for special endpoints like /blogs/featured or /properties/similar
   * @param endpoint - Custom endpoint path (e.g., '/featured', '/{id}/similar')
   * @param method - HTTP method
   * @param options - Optional data, isFormData, and locale
   * @returns Response from the custom endpoint
   */
  async custom<R = T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    options?: {
      data?: Record<string, any> | FormData;
      isFormData?: boolean;
      locale?: string;
      queryParams?: Record<string, any>;
    }
  ): Promise<ApiResponse<R>> {
    const { data, isFormData, locale, queryParams } = options || {};
    const path = `${this.basePath}${endpoint}`;
    const url = this.buildUrl(path, queryParams);

    switch (method) {
      case "GET":
        return await getData<R>({ url, locale });
      case "POST":
        return await postData<R>({ url, data, isFormData, locale });
      case "PUT":
        return await putData<R>({ url, data, isFormData, locale });
      case "DELETE":
        return await deleteData<R>({ url, locale });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
