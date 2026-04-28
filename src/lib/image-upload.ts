export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/gif";

const BLOCKED_IMAGE_MIME_TYPES = new Set(["image/webp", "image/avif"]);
const BLOCKED_IMAGE_EXTENSIONS = [".webp", ".avif"];

const hasBlockedImageExtension = (fileName: string): boolean => {
  const normalizedName = fileName.trim().toLowerCase();
  return BLOCKED_IMAGE_EXTENSIONS.some((ext) => normalizedName.endsWith(ext));
};

export const isBlockedImageFile = (file: File): boolean => {
  const mimeType = file.type.trim().toLowerCase();
  return (
    BLOCKED_IMAGE_MIME_TYPES.has(mimeType) || hasBlockedImageExtension(file.name)
  );
};

export const splitSupportedImageFiles = (files: File[]) => {
  const accepted: File[] = [];
  const rejected: File[] = [];

  for (const file of files) {
    if (isBlockedImageFile(file)) {
      rejected.push(file);
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
};
