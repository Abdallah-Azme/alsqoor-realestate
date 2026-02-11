# CRUD Base Class - Usage Guide

This guide shows you how to use the new `CrudBase` class to simplify your API interactions and reduce code duplication.

## Quick Start

### 1. Basic Usage

```typescript
import { CrudBase } from "@/lib/crud-base";
import { Blog } from "@/types";

// Create a service instance
const blogsService = new CrudBase<Blog>("/blogs");

// Get all blogs with pagination
const response = await blogsService.getAll({ page: 1, per_page: 10 });

// Get a single blog
const blog = await blogsService.getById(1);

// Create a new blog
const newBlog = await blogsService.create({
  title: "My New Blog",
  description: "Blog content here...",
});

// Update a blog
const updated = await blogsService.update(1, {
  title: "Updated Title",
});

// Delete a blog
await blogsService.delete(1);
```

## Real-World Examples

### Example 1: Simple Action File (Recommended Pattern)

**Before** - `blog-actions.ts` (old way):

```typescript
"use server";

import { getData } from "./fetch-methods";
import { ApiResponse, Blog, PaginatedResponse } from "@/types";

export async function getBlogs(
  page = 1,
  perPage = 6
): Promise<ApiResponse<PaginatedResponse<Blog>>> {
  const url = `/blogs?page=${page}&per_page=${perPage}`;
  return await getData<PaginatedResponse<Blog>>({ url });
}

export async function getBlogById(
  id: number | string
): Promise<ApiResponse<Blog>> {
  const url = `/blogs/${id}`;
  return await getData<Blog>({ url });
}
```

**After** - `blog-actions.ts` (new way):

```typescript
"use server";

import { CrudBase } from "./crud-base";
import { Blog } from "@/types";

// Create a singleton instance
const blogsService = new CrudBase<Blog>("/blogs");

export async function getBlogs(page = 1, perPage = 6) {
  return await blogsService.getAll({ page, per_page: perPage });
}

export async function getBlogById(id: number | string) {
  return await blogsService.getById(id);
}

export async function createBlog(data: Partial<Blog>) {
  return await blogsService.create(data);
}

export async function updateBlog(id: number | string, data: Partial<Blog>) {
  return await blogsService.update(id, data);
}

export async function deleteBlog(id: number | string) {
  return await blogsService.delete(id);
}
```

### Example 2: Advanced - Custom Endpoints

```typescript
"use server";

import { CrudBase } from "./crud-base";
import { Property } from "@/types";

const propertiesService = new CrudBase<Property>("/properties");

// Standard CRUD operations
export async function getProperties(filters?: Record<string, any>) {
  return await propertiesService.getAll(filters);
}

export async function getPropertyById(id: string | number) {
  return await propertiesService.getById(id);
}

// Custom endpoint: /properties/featured
export async function getFeaturedProperties() {
  return await propertiesService.custom("/featured", "GET", {
    revalidate: 3600, // cache for 1 hour
  });
}

// Custom endpoint: /properties/{id}/similar
export async function getSimilarProperties(id: string | number) {
  return await propertiesService.custom(`/${id}/similar`, "GET", {
    revalidate: 300,
  });
}

// Create property with FormData (for file uploads)
export async function addProperty(formData: FormData) {
  return await propertiesService.create(formData, true); // true = isFormData
}
```

### Example 3: Extended Class for Complex Logic

If you need custom business logic, you can extend the base class:

```typescript
"use server";

import { CrudBase } from "./crud-base";
import { Deal, ApiResponse } from "@/types";

class DealsService extends CrudBase<Deal> {
  constructor() {
    super("/direct-deals");
  }

  // Custom method with business logic
  async getActiveDealsByUser(userId: number) {
    const response = await this.custom("/user-deals", "GET", {
      queryParams: { user_id: userId, status: "active" },
    });
    return response;
  }

  // Override create to add validation
  async create(
    data: Record<string, any> | FormData,
    isFormData = false
  ): Promise<ApiResponse<Deal>> {
    // Add custom validation
    if (!isFormData && !data.title) {
      return {
        success: false,
        code: 400,
        message: "Title is required",
      };
    }

    // Call parent create method
    return super.create(data, isFormData);
  }
}

// Export singleton instance
const dealsService = new DealsService();

export async function getUserDeals(userId: number) {
  return await dealsService.getActiveDealsByUser(userId);
}

export async function addDeal(formData: FormData) {
  return await dealsService.create(formData, true);
}
```

## API Reference

### Constructor

```typescript
new CrudBase<T>(basePath: string)
```

- `basePath`: Base API path (e.g., `/blogs`, `/properties`, `/companies`)

### Methods

#### `getAll(options?)`

Fetch all items with optional pagination and filtering.

```typescript
await service.getAll({
  page: 1,
  per_page: 10,
  status: "active",
  locale: "ar",
  revalidate: 60,
});
```

**Parameters:**

- `page?: number` - Page number for pagination
- `per_page?: number` - Items per page
- `locale?: string` - Language locale
- `revalidate?: number` - Cache revalidation time in seconds
- `[key: string]: any` - Any additional query parameters

**Returns:** `ApiResponse<PaginatedResponse<T> | T[]>`

---

#### `getById(id, options?)`

Fetch a single item by ID.

```typescript
await service.getById(123, {
  locale: "ar",
  revalidate: 3600,
});
```

**Parameters:**

- `id: string | number` - Item ID
- `options?: { locale?: string, revalidate?: number }`

**Returns:** `ApiResponse<T>`

---

#### `create(data, isFormData?, options?)`

Create a new item.

```typescript
// JSON data
await service.create({ title: "New Item", description: "Details" });

// FormData (for file uploads)
const formData = new FormData();
formData.append("title", "New Item");
formData.append("image", fileBlob);
await service.create(formData, true);
```

**Parameters:**

- `data: Record<string, any> | FormData` - Item data
- `isFormData?: boolean` - Set to `true` for FormData uploads (default: `false`)
- `options?: { locale?: string }`

**Returns:** `ApiResponse<T>`

---

#### `update(id, data, isFormData?, options?)`

Update an existing item.

```typescript
await service.update(123, { title: "Updated Title" });
```

**Parameters:**

- `id: string | number` - Item ID to update
- `data: Record<string, any> | FormData` - Updated data
- `isFormData?: boolean` - Set to `true` for FormData uploads (default: `false`)
- `options?: { locale?: string }`

**Returns:** `ApiResponse<T>`

---

#### `delete(id, options?)`

Delete an item.

```typescript
await service.delete(123);
```

**Parameters:**

- `id: string | number` - Item ID to delete
- `options?: { locale?: string }`

**Returns:** `ApiResponse<T>`

---

#### `custom<R>(endpoint, method?, options?)`

Call custom endpoints within the same base path.

```typescript
// GET /blogs/featured
await blogsService.custom('/featured', 'GET');

// POST /properties/bulk-import
await propertiesService.custom('/bulk-import', 'POST', {
  data: { items: [...] },
  isFormData: false
});

// GET /companies?type=partner&verified=true
await companiesService.custom('', 'GET', {
  queryParams: { type: 'partner', verified: true }
});
```

**Parameters:**

- `endpoint: string` - Custom endpoint path (e.g., `/featured`, `/${id}/similar`)
- `method?: 'GET' | 'POST' | 'PUT' | 'DELETE'` - HTTP method (default: `'GET'`)
- `options?:`
  - `data?: Record<string, any> | FormData` - Request body
  - `isFormData?: boolean` - Whether data is FormData
  - `locale?: string` - Language locale
  - `revalidate?: number` - Cache revalidation time
  - `queryParams?: Record<string, any>` - URL query parameters

**Returns:** `ApiResponse<R>`

## Migration Guide

To migrate existing action files to use the CRUD base class:

1. **Import the base class:**

   ```typescript
   import { CrudBase } from "./crud-base";
   ```

2. **Create a service instance:**

   ```typescript
   const service = new CrudBase<YourType>("/your-endpoint");
   ```

3. **Replace direct fetch calls with service methods:**

   - `getData(...)` → `service.getAll(...)` or `service.getById(...)`
   - `postData(...)` → `service.create(...)`
   - `putData(...)` → `service.update(...)`
   - `deleteData(...)` → `service.delete(...)`

4. **For special endpoints, use the `custom()` method**

## Benefits

✅ **Less Code** - Reduce boilerplate by 50-70%  
✅ **Type Safety** - Full TypeScript support with generics  
✅ **Consistency** - Same interface across all entities  
✅ **Maintainability** - Single source of truth for CRUD logic  
✅ **Flexibility** - Easy to extend or customize  
✅ **Built-in Features** - Pagination, filtering, auth, i18n, error handling

## Notes

- All methods automatically handle:
  - ✓ Authentication headers (Bearer token)
  - ✓ Locale headers (Accept-Language)
  - ✓ 401 Unauthorized errors
  - ✓ JSON/FormData content types
  - ✓ Error responses
- Response format follows your existing `ApiResponse<T>` interface
- Compatible with Next.js server actions (`"use server"`)
- Works with your existing `react-query` setup
