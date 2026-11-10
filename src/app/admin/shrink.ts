"use client";

/**
 * Photos are made smaller in the browser before they are sent: the server takes at most 4MB
 * per save (Vercel's limit is 4.5MB), and a phone photo is often 5 to 10MB.
 * The long side becomes at most 2400px, which is more than any place on the site shows.
 */
const MAX_SIDE = 2400;
const TARGET = 2.5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function shrinkImage(file: File): Promise<File> {
  if (!TYPES.includes(file.type) || file.size === 0) return file;
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= TARGET) {
    bmp.close();
    return file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  // PNG may have see-through parts, so it becomes WEBP (keeps them); everything else becomes JPG
  const type = file.type === "image/png" ? "image/webp" : "image/jpeg";
  let out: Blob | null = null;
  for (const q of [0.86, 0.78, 0.7, 0.6]) {
    out = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, type, q));
    if (out && out.size <= TARGET) break;
  }
  if (!out || out.size >= file.size) return file;
  const name = file.name.replace(/\.[^.]+$/, "") + (type === "image/webp" ? ".webp" : ".jpg");
  return new File([out], name, { type });
}

/** Replaces every photo in the form with its smaller copy. */
export async function shrinkForm(fd: FormData): Promise<void> {
  for (const [key, value] of Array.from(fd.entries())) {
    if (value instanceof File && TYPES.includes(value.type) && value.size > 0) {
      const all = fd.getAll(key);
      fd.delete(key);
      for (const v of all) fd.append(key, v instanceof File ? await shrinkImage(v) : v);
    }
  }
}
