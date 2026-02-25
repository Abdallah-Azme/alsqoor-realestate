"use client";

import React, { useState, useRef } from "react";
import { FiUploadCloud, FiX, FiImage, FiVideo } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  label?: string;
  helperText?: string;
}

export function FileUploader({
  value = [],
  onChange,
  accept = "image/*",
  maxFiles = 10,
  label = "Upload files",
  helperText = "Drag & drop files here or click to browse",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);

    // Check total files doesn't exceed maxFiles
    if (value.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    onChange([...value, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = ""; // reset input so you can select the same file again if deleted
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  const isVideo = accept.includes("video");

  return (
    <div className="w-full space-y-4">
      {/* Label (Optional) */}
      {label && <p className="text-sm font-medium text-main-navy">{label}</p>}

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-main-green bg-main-green/5"
            : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300",
        )}
      >
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <FiUploadCloud className="w-8 h-8 text-main-green" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {isDragging ? "Drop files now..." : "Click or drag files here"}
        </p>
        <p className="text-xs text-gray-500">{helperText}</p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {value.map((file, idx) => {
            const isExisting = typeof file === "string";
            const fileUrl = isExisting
              ? (file as string)
              : URL.createObjectURL(file as File);
            const fileName = isExisting
              ? (file as string).split("/").pop()
              : (file as File).name;

            return (
              <div
                key={
                  isExisting
                    ? `existing-${idx}`
                    : `${(file as File).name}-${idx}`
                }
                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square flex items-center justify-center shadow-sm"
              >
                {isVideo ? (
                  <div className="relative w-full h-full bg-gray-900 group">
                    <video
                      src={fileUrl}
                      className="w-full h-full object-cover opacity-80"
                      muted
                      onLoadedData={() =>
                        !isExisting && URL.revokeObjectURL(fileUrl)
                      }
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <FiVideo className="w-8 h-8 text-white/70" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="w-full h-full object-cover"
                    onLoad={() => !isExisting && URL.revokeObjectURL(fileUrl)}
                  />
                )}

                {/* Overlay / Remove Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>

                {/* File size indicator */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-linear-to-t from-black/80 to-transparent">
                  <p className="text-[10px] text-white truncate rtl:text-right">
                    {fileName}{" "}
                    {!isExisting &&
                      `(${((file as File).size / 1024 / 1024).toFixed(2)} MB)`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
