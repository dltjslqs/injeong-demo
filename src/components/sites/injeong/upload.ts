/** Attachment rules shared by the inquiry form and /api/inquiry. */
export const UPLOAD = {
  maxFileMB: 50,
  maxFiles: 10,
  maxTotalMB: 200,
  // drawings, documents, photos and archives that clients usually send with a quote request
  exts: ["pdf", "dwg", "dxf", "jpg", "jpeg", "png", "heic", "hwp", "hwpx", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"],
};

export const MB = 1024 * 1024;

export function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

export function formatSize(bytes: number) {
  return bytes >= MB ? `${(bytes / MB).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`;
}
