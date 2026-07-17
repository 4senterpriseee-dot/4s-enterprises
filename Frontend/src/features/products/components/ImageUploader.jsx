import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FILES = 7;
const MAX_SIZE_MB = 5;

/**
 * ImageUploader — Drag-and-drop multi-image picker with preview grid.
 *
 * @param {File[]}   files    — controlled array of File objects
 * @param {Function} onChange — called with updated File[]
 * @param {string}   [error]  — validation error message
 */
const ImageUploader = ({ files, onChange, error }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const canUploadMore = files.length < MAX_FILES;

  const previews = useMemo(
    () =>
      files.map((file) => {
        if (file instanceof File) return { file, url: URL.createObjectURL(file) };
        return { file, url: file.url || file }; // Handle existing DB images
      }),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.file instanceof File) URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  /* ── Merge incoming files, deduplicate by name+size ── */
  const mergeFiles = useCallback(
    (incoming) => {
      const existingKeys = new Set(
        files.map((f) => (f instanceof File ? `${f.name}-${f.size}` : f.url))
      );
      const fresh = Array.from(incoming).filter(
        (f) => !existingKeys.has(`${f.name}-${f.size}`)
      );
      return [...files, ...fresh].slice(0, MAX_FILES);
    },
    [files]
  );

  const handleFiles = (incoming) => onChange(mergeFiles(incoming));

  /* ── Drag events ── */
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ── Click to browse ── */
  const onInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = ""; // allow re-selecting same file
  };

  const removeFile = (index) => {
    const fileToRemove = files[index];
    if (!(fileToRemove instanceof File) && onChange.onRemoveExisting) {
      onChange.onRemoveExisting(fileToRemove);
    }
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>{files.length} / {MAX_FILES} images</span>
        {!canUploadMore && <span>Maximum {MAX_FILES} images uploaded</span>}
      </div>

      {/* ── Drop zone ── */}
      <div
        className={[
          "transition-all duration-300 ease-out overflow-hidden",
          canUploadMore ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload product images"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            "flex flex-col items-center justify-center gap-2",
            "rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer",
            "transition-colors duration-150",
            error
              ? "border-[var(--error)] bg-[var(--error-bg)]"
              : isDragging
              ? "border-[var(--border-focus)] bg-[var(--card-subtle)]"
              : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-subtle)] hover:border-[var(--border-focus)]",
          ].join(" ")}
        >
          <ImagePlus
            size={22}
            strokeWidth={1.5}
            className={error ? "text-[var(--error)]" : "text-[var(--text-muted)]"}
          />
          <p className="text-sm font-medium text-(--text) text-center">
            Drag images here or{" "}
            <span className="text-[var(--primary-btn)] underline-offset-2 hover:underline">
              click to browse
            </span>
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Up to {MAX_FILES} images · Max {MAX_SIZE_MB} MB each
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={onInputChange}
          />
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p role="alert" className="text-[11px] text-[var(--error)]">
          {error}
        </p>
      )}

      {/* ── Preview grid ── */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {previews.map(({ file, url }, i) => (
            <div
              key={`${file.name}-${i}`}
              className="relative rounded-lg overflow-hidden aspect-square bg-[var(--card-subtle)]"
            >
              <img
                src={url}
                alt={file instanceof File ? file.name : "Existing image"}
                className="w-full h-full object-cover"
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                aria-label={`Remove image`}
                onClick={() => removeFile(i)}
                className={[
                  "absolute top-1.5 right-1.5",
                  "size-7 rounded-full",
                  "border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)]",
                  "hover:bg-[var(--card-subtle)]",
                ].join(" ")}
              >
                <X size={12} strokeWidth={2.25} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
