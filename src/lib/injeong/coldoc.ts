import type { Block } from "@/components/sites/injeong/columns";

/**
 * The column editor works on a Tiptap document; the site stores and renders Block[].
 * These two functions are the whole bridge. Bold inside a paragraph, list item or table cell
 * travels as **text** in the block string (the article renders it as <strong>).
 */
export type DocNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  text?: string;
  marks?: { type: string }[];
};

/* ---------- blocks → editor ---------- */

function inline(text: string): DocNode[] {
  const out: DocNode[] = [];
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (!part) return;
    const b = part.match(/^\*\*([^*]+)\*\*$/);
    out.push(b ? { type: "text", text: b[1], marks: [{ type: "bold" }] } : { type: "text", text: part });
  });
  return out;
}
const para = (text: string): DocNode => ({ type: "paragraph", content: text ? inline(text) : undefined });
const cell = (type: "tableHeader" | "tableCell", text: string): DocNode => ({ type, content: [para(text)] });

/** `photo` turns a built-in project photo id or series cover id into an image the editor can show. */
export function blocksToDoc(blocks: Block[], photo: { project: (id: string) => { src: string; cap: string } | null; cover: (id: string) => string }): DocNode {
  const content: DocNode[] = [];
  for (const b of blocks) {
    switch (b.t) {
      case "p": content.push(para(b.x)); break;
      case "q": content.push({ type: "blockquote", content: [para(b.x)] }); break;
      case "h2": content.push({ type: "heading", attrs: { level: 2 }, content: inline(b.x.replace(/\*\*/g, "")) }); break;
      case "h3": content.push({ type: "heading", attrs: { level: 3 }, content: inline(b.x.replace(/\*\*/g, "")) }); break;
      case "ask": content.push({ type: "askBox", content: b.x ? [{ type: "text", text: b.x }] : undefined }); break;
      case "ul":
      case "ol":
        content.push({ type: b.t === "ul" ? "bulletList" : "orderedList", content: b.items.map((x) => ({ type: "listItem", content: [para(x)] })) });
        break;
      case "table":
        content.push({
          type: "table",
          content: [
            { type: "tableRow", content: b.head.map((h) => cell("tableHeader", h)) },
            ...b.rows.map((r) => ({ type: "tableRow", content: r.map((c) => cell("tableCell", c)) })),
          ],
        });
        break;
      case "img": {
        const p = photo.project(b.id);
        if (p) content.push({ type: "image", attrs: { src: p.src, alt: p.cap, title: `project:${b.id}` } });
        break;
      }
      case "cover": content.push({ type: "image", attrs: { src: photo.cover(b.src), alt: "", title: `cover:${b.src}` } }); break;
      case "pic": content.push({ type: "image", attrs: { src: b.src, alt: b.cap ?? "", title: null } }); break;
    }
  }
  return { type: "doc", content: content.length ? content : [para("")] };
}

/* ---------- editor → blocks ---------- */

function text(n: DocNode | undefined, bold = true): string {
  if (!n) return "";
  if (n.type === "text") {
    const t = n.text ?? "";
    return bold && n.marks?.some((m) => m.type === "bold") && t.trim() ? `**${t}**` : t;
  }
  if (n.type === "hardBreak") return " ";
  return (n.content ?? []).map((c) => text(c, bold)).join(n.type === "listItem" || n.type === "blockquote" || n.type === "tableCell" || n.type === "tableHeader" ? " " : "");
}
const clean = (s: string) => s.replace(/\*\*\*\*/g, "").replace(/\s+/g, " ").trim();

export function docToBlocks(doc: DocNode): Block[] {
  const blocks: Block[] = [];
  for (const n of doc.content ?? []) {
    switch (n.type) {
      case "paragraph": { const x = clean(text(n)); if (x) blocks.push({ t: "p", x }); break; }
      case "heading": {
        const x = clean(text(n, false));
        if (x) blocks.push({ t: Number(n.attrs?.level) === 3 ? "h3" : "h2", x });
        break;
      }
      case "blockquote": { const x = clean(text(n)); if (x) blocks.push({ t: "q", x }); break; }
      case "askBox": { const x = clean(text(n, false)); blocks.push({ t: "ask", x: x || "공사 상담이 필요하다면," }); break; }
      case "bulletList":
      case "orderedList": {
        const items = (n.content ?? []).map((li) => clean(text(li))).filter(Boolean);
        if (items.length) blocks.push({ t: n.type === "bulletList" ? "ul" : "ol", items });
        break;
      }
      case "table": {
        const rows = (n.content ?? []).map((r) => (r.content ?? []).map((c) => clean(text(c))));
        if (rows.length) blocks.push({ t: "table", head: rows[0], rows: rows.slice(1) });
        break;
      }
      case "image": {
        const src = String(n.attrs?.src ?? "");
        const title = String(n.attrs?.title ?? "");
        const alt = String(n.attrs?.alt ?? "").trim();
        if (title.startsWith("project:")) blocks.push({ t: "img", id: title.slice(8) });
        else if (title.startsWith("cover:")) blocks.push({ t: "cover", src: title.slice(6) });
        else if (src) blocks.push({ t: "pic", src, cap: alt || undefined });
        break;
      }
    }
  }
  return blocks;
}

/** Accepts only well-formed blocks from a submitted form. */
export function sanitizeBlocks(input: unknown): Block[] {
  if (!Array.isArray(input)) return [];
  const s = (v: unknown) => (typeof v === "string" ? v.slice(0, 5000) : "");
  const list = (v: unknown) => (Array.isArray(v) ? v.map(s).slice(0, 200) : []);
  const out: Block[] = [];
  for (const b of input as Record<string, unknown>[]) {
    if (!b || typeof b !== "object") continue;
    switch (b.t) {
      case "p": case "q": case "h2": case "h3": case "ask": if (s(b.x)) out.push({ t: b.t, x: s(b.x) }); break;
      case "ul": case "ol": out.push({ t: b.t, items: list(b.items) }); break;
      case "table": out.push({ t: "table", head: list(b.head), rows: (Array.isArray(b.rows) ? b.rows : []).map(list).slice(0, 200) }); break;
      case "img": if (/^[\w-]+$/.test(s(b.id))) out.push({ t: "img", id: s(b.id) }); break;
      case "cover": if (/^[\w-]+$/.test(s(b.src))) out.push({ t: "cover", src: s(b.src) }); break;
      case "pic": {
        const src = s(b.src);
        if (/^(https:\/\/|\/api\/uploads\/)/.test(src)) out.push({ t: "pic", src, cap: s(b.cap) || undefined });
        break;
      }
    }
  }
  return out;
}
