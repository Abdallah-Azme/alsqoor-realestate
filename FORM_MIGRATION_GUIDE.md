# Form Migration to Shadcn Style - Implementation Guide

## Overview

This document outlines the migration of all forms in the application to use shadcn Form components with proper bilingual (Arabic/English) error handling.

## What Changed

### 1. Form Components

**Before:**

```tsx
<Label htmlFor="title">العنوان *</Label>
<Input id="title" {...register("title")} />
{errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
```

**After:**

```tsx
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("title")} *</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 2. Validation Messages

All validation messages are now translatable through the `validation` namespace:

**English (en.json):**

```json
"validation": {
  "required": "This field is required",
  "string_min": "Must be at least {min} characters",
  "string_max": "Must not exceed {max} characters",
  "number_positive": "Must be a positive number",
  "email": "Invalid email address"
}
```

**Arabic (ar.json):**

```json
"validation": {
  "required": "هذا الحقل مطلوب",
  "string_min": "يجب أن يكون {min} حرفًا على الأقل",
  "string_max": "يجب ألا يتجاوز {max} حرفًا",
  "number_positive": "يجب أن يكون رقمًا موجبًا",
  "email": "عنوان البريد الإلكتروني غير صالح"
}
```

### 3. Schema Factory Pattern

Schemas now use a factory function that accepts a translation function:

```typescript
export const createPropertySchema = (
  t: (key: string, values?: Record<string, any>) => string,
) => {
  const propertySchema = z.object({
    title: z
      .string()
      .min(5, t("string_min", { min: 5 }))
      .max(255, t("string_max", { max: 255 })),
    // ...
  });

  return { propertySchema };
};
```

## Forms Updated

### ✅ Completed

1. **add-property-dialog.tsx** - Property creation form with full shadcn Form integration

### 🔄 Pending

2. **submit-offer-dialog.tsx** - Offer submission form
3. **owner-registration-form.tsx** - Owner registration
4. **seeker-registration-form.tsx** - Seeker registration
5. **developer-registration-form.tsx** - Developer registration
6. **agent-registration-form.tsx** - Agent registration
7. **add-request-form.tsx** - Request creation form
8. **add-request-dialog.tsx** - Request dialog form

## Implementation Steps for Each Form

1. **Import shadcn Form components:**

   ```tsx
   import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
   } from "@/components/ui/form";
   ```

2. **Add validation translation hook:**

   ```tsx
   const tValidation = useTranslations("validation");
   ```

3. **Create schema with translations:**

   ```tsx
   const { schema } = createYourSchema(tValidation);
   ```

4. **Wrap form with Form component:**

   ```tsx
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>{/* form fields */}</form>
   </Form>
   ```

5. **Convert each field to FormField:**
   - Replace manual Label + Input + error message
   - Use FormField with render prop
   - Wrap input in FormControl
   - Use FormMessage for automatic error display

## Benefits

1. **Consistent Error Display**: All forms show errors in the same way
2. **Bilingual Support**: Automatic translation of validation messages
3. **Better Accessibility**: Proper ARIA attributes and form associations
4. **Type Safety**: Full TypeScript support with proper types
5. **Maintainability**: Centralized validation logic and error messages

## Testing Checklist

For each migrated form, verify:

- [ ] Form submits correctly with valid data
- [ ] Validation errors appear in both Arabic and English
- [ ] Error messages are properly translated
- [ ] Required fields show appropriate errors when empty
- [ ] Number fields validate min/max correctly
- [ ] String fields validate length correctly
- [ ] Form resets properly after successful submission
- [ ] Loading states work correctly
- [ ] Error states from API are handled properly
