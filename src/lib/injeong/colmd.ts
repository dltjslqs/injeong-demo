import type { Block } from "@/components/sites/injeong/columns";

/**
 * The writing format the admin uses for a column body, and its round trip to the blocks the site renders.
 *
 *   ## 소제목              → section heading        ### 작은 제목 → sub-heading
 *   > "건축주의 질문"       → highlighted question  - 항목 / 1) 항목 → lists
 *   | 표 | 머리 |          → table (first row is the head; a |---| row is optional)
 *   [사진: 주소 | 설명]     → photo uploaded in the admin
 *   [실적사진: p18]         → a project photo        [표지사진: s1] → a series cover
 *   [상담: 공장 신축이 필요하다면,] → the contact box with the 견적 문의 button
 *   anything else          → paragraphs, separated by a blank line
 */
export function mdToBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    const t = para.join(" ").trim();
    if (t) {
      const q = /^[“"].*[”"]$/.test(t) && (t.match(/[“”"]/g) ?? []).length === 2;
      blocks.push({ t: q ? "q" : "p", x: curly(t) });
    }
    para = [];
  };
  const LI = /^(?:[-*] |\d+[.)] )/;
  for (let i = 0; i < lines.length; ) {
    const ln = lines[i].trim();
    let m: RegExpMatchArray | null;
    if (!ln) { flush(); i++; continue; }
    if ((m = ln.match(/^\[사진:\s*([^|\]]+?)\s*(?:\|\s*([^\]]*))?\]$/))) { flush(); blocks.push({ t: "pic", src: m[1], cap: m[2]?.trim() || undefined }); i++; continue; }
    if ((m = ln.match(/^\[실적사진:\s*([\w-]+)\s*\]$/))) { flush(); blocks.push({ t: "img", id: m[1] }); i++; continue; }
    if ((m = ln.match(/^\[표지사진:\s*([\w-]+)\s*\]$/))) { flush(); blocks.push({ t: "cover", src: m[1] }); i++; continue; }
    if ((m = ln.match(/^\[상담:\s*([^\]]+)\]$/))) { flush(); blocks.push({ t: "ask", x: m[1].trim() }); i++; continue; }
    if ((m = ln.match(/^#{3}\s+(.+)$/)) && !ln.startsWith("####")) { flush(); blocks.push({ t: "h3", x: curly(m[1]) }); i++; continue; }
    if ((m = ln.match(/^#{2}\s+(.+)$/)) || (m = ln.match(/^#{4}\s+(.+)$/))) { flush(); blocks.push({ t: "h2", x: curly(m[1]) }); i++; continue; }
    if ((m = ln.match(/^>\s*(.+)$/))) { flush(); blocks.push({ t: "q", x: curly(m[1]) }); i++; continue; }
    if (LI.test(ln)) {
      flush();
      const ordered = !/^[-*] /.test(ln);
      const items: string[] = [];
      while (i < lines.length && LI.test(lines[i].trim())) items.push(curly(lines[i++].trim().replace(LI, "")));
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    if (ln.startsWith("|")) {
      flush();
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i++].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells.map(curly));
      }
      if (rows.length) blocks.push({ t: "table", head: rows[0], rows: rows.slice(1) });
      continue;
    }
    para.push(ln);
    i++;
  }
  flush();
  return blocks;
}

export function blocksToMd(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.t) {
        case "p": return b.x;
        case "q": return `> ${b.x}`;
        case "h2": return `## ${b.x}`;
        case "h3": return `### ${b.x}`;
        case "ask": return `[상담: ${b.x}]`;
        case "img": return `[실적사진: ${b.id}]`;
        case "cover": return `[표지사진: ${b.src}]`;
        case "pic": return `[사진: ${b.src}${b.cap ? ` | ${b.cap}` : ""}]`;
        case "ul": return b.items.map((x) => `- ${x}`).join("\n");
        case "ol": return b.items.map((x, k) => `${k + 1}) ${x}`).join("\n");
        case "table": return [b.head, b.head.map(() => "---"), ...b.rows].map((r) => `| ${r.join(" | ")} |`).join("\n");
      }
    })
    .join("\n\n");
}

function curly(t: string) {
  return t.replace(/\*\*/g, "").replace(/"([^"]*)"/g, "“$1”");
}
