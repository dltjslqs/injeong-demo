import { readUpload } from "@/lib/injeong/store";

// Photos uploaded in the admin on a server with a local disk (on Vercel they are Blob URLs instead).
export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const file = await readUpload(name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.bytes), {
    headers: { "Content-Type": file.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
