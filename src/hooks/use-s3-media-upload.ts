"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { isBlockedImageFile } from "@/lib/image-upload";
import {
  getMediaFileKey,
  uploadFilesToS3,
  type S3UploadPurpose,
} from "@/lib/s3-client-upload";

export type S3MediaItem = File | string;

function applyS3KeysToMedia(
  current: S3MediaItem[],
  files: File[],
  results: { key: string }[],
): S3MediaItem[] {
  const fileKeyToS3Key = new Map<string, string>();
  files.forEach((file, index) => {
    const s3Key = results[index]?.key;
    if (s3Key) fileKeyToS3Key.set(getMediaFileKey(file), s3Key);
  });

  return current.map((item) => {
    if (!(item instanceof File)) return item;
    return fileKeyToS3Key.get(getMediaFileKey(item)) ?? item;
  });
}

async function normalizeImageFile(file: File): Promise<File> {
  if (isBlockedImageFile(file)) {
    throw new Error("format");
  }
  return file;
}

type UploadPurposes = {
  images: S3UploadPurpose;
  videos: S3UploadPurpose;
  qr?: S3UploadPurpose;
};

export function useS3MediaUpload(purposes: UploadPurposes) {
  const [uploadingImageKeys, setUploadingImageKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [uploadingVideoKeys, setUploadingVideoKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [uploadingQrKeys, setUploadingQrKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const markUploading = useCallback(
    (keys: string[], kind: "image" | "video" | "qr", uploading: boolean) => {
      const setter =
        kind === "image"
          ? setUploadingImageKeys
          : kind === "video"
            ? setUploadingVideoKeys
            : setUploadingQrKeys;
      setter((prev) => {
        const next = new Set(prev);
        keys.forEach((key) => {
          if (uploading) next.add(key);
          else next.delete(key);
        });
        return next;
      });
    },
    [],
  );

  const uploadFilesImmediately = useCallback(
    async (
      files: File[],
      purpose: S3UploadPurpose,
      kind: "image" | "video" | "qr",
      current: S3MediaItem[],
      onUpdated: (next: S3MediaItem[]) => void,
      isRtl: boolean,
    ) => {
      if (files.length === 0) return;

      const trackingKeys = files.map(getMediaFileKey);
      markUploading(trackingKeys, kind, true);

      try {
        const prepared =
          kind === "video"
            ? files
            : await Promise.all(
                files.map(async (file) => {
                  try {
                    return await normalizeImageFile(file);
                  } catch {
                    throw new Error("format");
                  }
                }),
              );

        const results = await uploadFilesToS3(prepared, purpose);
        onUpdated(applyS3KeysToMedia(current, files, results));
      } catch (error) {
        console.error(`[S3] ${kind} upload failed:`, error);
        onUpdated(
          current.filter(
            (item) =>
              !(item instanceof File) ||
              !trackingKeys.includes(getMediaFileKey(item)),
          ),
        );
        const formatError =
          error instanceof Error && error.message === "format";
        toast.error(
          formatError
            ? isRtl
              ? "صيغة الصورة غير مدعومة"
              : "Unsupported image format"
            : isRtl
              ? "فشل رفع الملف. حاول مرة أخرى."
              : "Upload failed. Please try again.",
        );
      } finally {
        markUploading(trackingKeys, kind, false);
      }
    },
    [markUploading],
  );

  const handleMediaChange = useCallback(
    (
      kind: "image" | "video" | "qr",
      previous: S3MediaItem[],
      next: S3MediaItem[],
      onUpdated: (value: S3MediaItem[]) => void,
      isRtl: boolean,
    ) => {
      const addedFiles = next.filter(
        (item): item is File =>
          item instanceof File && !previous.some((prev) => prev === item),
      );
      onUpdated(next);

      if (addedFiles.length === 0) return;

      const purpose =
        kind === "image"
          ? purposes.images
          : kind === "video"
            ? purposes.videos
            : purposes.qr;

      if (!purpose) return;

      void uploadFilesImmediately(
        addedFiles,
        purpose,
        kind,
        next,
        onUpdated,
        isRtl,
      );
    },
    [purposes.images, purposes.qr, purposes.videos, uploadFilesImmediately],
  );

  const isImageItemUploading = useCallback(
    (item: S3MediaItem) =>
      item instanceof File && uploadingImageKeys.has(getMediaFileKey(item)),
    [uploadingImageKeys],
  );

  const isVideoItemUploading = useCallback(
    (item: S3MediaItem) =>
      item instanceof File && uploadingVideoKeys.has(getMediaFileKey(item)),
    [uploadingVideoKeys],
  );

  const isQrItemUploading = useCallback(
    (item: S3MediaItem) =>
      item instanceof File && uploadingQrKeys.has(getMediaFileKey(item)),
    [uploadingQrKeys],
  );

  const hasPendingMediaFiles = useCallback(
    (images: S3MediaItem[], videos: S3MediaItem[], qr: S3MediaItem[]) =>
      images.some((item) => item instanceof File) ||
      videos.some((item) => item instanceof File) ||
      qr.some((item) => item instanceof File),
    [],
  );

  const isUploadingMedia =
    uploadingImageKeys.size > 0 ||
    uploadingVideoKeys.size > 0 ||
    uploadingQrKeys.size > 0;

  const resetUploadingState = useCallback(() => {
    setUploadingImageKeys(new Set());
    setUploadingVideoKeys(new Set());
    setUploadingQrKeys(new Set());
  }, []);

  return {
    handleMediaChange,
    isImageItemUploading,
    isVideoItemUploading,
    isQrItemUploading,
    hasPendingMediaFiles,
    isUploadingMedia,
    resetUploadingState,
  };
}
