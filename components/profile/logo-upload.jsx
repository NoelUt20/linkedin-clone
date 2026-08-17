"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

import { resizeImageToDataUrl } from "@/lib/resize-image";

export function LogoUpload({ label, logo, onChange, fallback }) {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImageToDataUrl(file, { maxWidth: 200, maxHeight: 200 });
    onChange(dataUrl);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="size-full object-cover" />
        ) : (
          fallback
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={label}
          className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full border border-border bg-background text-foreground shadow hover:bg-muted"
        >
          <Camera className="size-3" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {logo && (
        <button
          type="button"
          className="text-xs text-muted-foreground hover:underline"
          onClick={() => onChange(null)}
        >
          Remove logo
        </button>
      )}
    </div>
  );
}
