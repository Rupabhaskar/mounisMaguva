"use client";

import { useState } from "react";

export default function ColorImagesEditor({ colors, colorImages, onChange }) {
  const [urlDrafts, setUrlDrafts] = useState({});

  if (!colors.length) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        Add at least one color above to link images per color.
      </p>
    );
  }

  function getDraft(color) {
    return urlDrafts[color] ?? "";
  }

  function setDraft(color, value) {
    setUrlDrafts((d) => ({ ...d, [color]: value }));
  }

  function addImages(color, raw) {
    const urls = String(raw || "")
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    if (!urls.length) return;

    const existing = colorImages[color] || [];
    const merged = [...existing];
    urls.forEach((url) => {
      if (!merged.includes(url)) merged.push(url);
    });

    onChange({ ...colorImages, [color]: merged });
    setDraft(color, "");
  }

  function removeImage(color, url) {
    const next = (colorImages[color] || []).filter((u) => u !== url);
    const updated = { ...colorImages };
    if (next.length) {
      updated[color] = next;
    } else {
      delete updated[color];
    }
    onChange(updated);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium">Images per color</legend>
      <p className="text-xs text-[var(--color-muted)]">
        Add multiple image URLs for each color. Shoppers see these when they pick that color.
      </p>
      {colors.map((color) => (
        <div
          key={color}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/30 p-3"
        >
          <p className="mb-2 text-sm font-semibold text-[var(--color-primary)]">{color}</p>

          {(colorImages[color] || []).length > 0 ? (
            <ul className="mb-3 space-y-2">
              {(colorImages[color] || []).map((url, index) => (
                <li
                  key={`${color}-${url}-${index}`}
                  className="flex items-start gap-2 rounded-md border border-[var(--color-border)] bg-white px-2 py-1.5 text-xs"
                >
                  <span className="min-w-0 flex-1 break-all text-[var(--color-muted)]">{url}</span>
                  <button
                    type="button"
                    className="shrink-0 text-red-600 hover:underline"
                    onClick={() => removeImage(color, url)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-2 text-xs text-[var(--color-muted)]">No images for this color yet.</p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="input-field flex-1 text-sm"
              placeholder="Image URL (comma separated for multiple)"
              value={getDraft(color)}
              onChange={(e) => setDraft(color, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImages(color, getDraft(color));
                }
              }}
            />
            <button
              type="button"
              className="btn-outline shrink-0 text-sm"
              onClick={() => addImages(color, getDraft(color))}
            >
              Add images
            </button>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
