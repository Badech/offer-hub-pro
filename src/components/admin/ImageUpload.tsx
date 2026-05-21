import { useRef, useState } from "react";
import { uploadImage } from "@/lib/server-functions";

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const { url } = await uploadImage({ data: fd });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--brand)]">{label}</label>
      <div className="mt-2 flex flex-wrap items-start gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-md border border-[var(--border)] object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-md border border-dashed border-[var(--border)] grid place-items-center text-[12px] text-[var(--text-muted)]">
            No image
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL, or upload below"
            className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
              className="text-[12px]"
            />
            {uploading && (
              <span className="text-[12px] text-[var(--text-secondary)]">Uploading…</span>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[12px] text-[#b91c1c] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {error && (
            <div className="mt-2 text-[12px] text-[#b91c1c]" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
