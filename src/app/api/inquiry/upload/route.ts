import { issueSignedToken } from "@vercel/blob";
import { type HandleUploadPresignedBody, handleUploadPresigned } from "@vercel/blob/client";
import { extOf, MB, UPLOAD } from "@/components/sites/injeong/upload";

export const dynamic = "force-dynamic";

/**
 * Lets the quote form send each attachment straight from the browser to the Blob store.
 * The site's own server only takes 4.5MB a request on Vercel; drawings are often much larger.
 * Only names under inquiry/ with an allowed file type, up to the form's per-file limit, for ten minutes.
 */
const storeOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** The form asks first whether direct uploads work here. */
export async function GET() {
  return Response.json({ ok: storeOn() }, { status: storeOn() ? 200 : 501 });
}

export async function POST(req: Request) {
  if (!storeOn()) {
    // no store (local development): the form falls back to sending the files with the form itself
    return Response.json({ message: "no store" }, { status: 501 });
  }
  const body = (await req.json().catch(() => null)) as HandleUploadPresignedBody | null;
  if (!body) return Response.json({ message: "bad request" }, { status: 400 });
  try {
    const result = await handleUploadPresigned({
      body,
      request: req,
      getSignedToken: async (pathname) => {
        if (!/^inquiry\/\d{8}\/[^/]+$/.test(pathname) || !UPLOAD.exts.includes(extOf(pathname))) throw new Error("이 파일은 받을 수 없습니다.");
        const validUntil = Date.now() + 10 * 60 * 1000;
        const maximumSizeInBytes = UPLOAD.maxFileMB * MB;
        const token = await issueSignedToken({ pathname, operations: ["put"], validUntil, maximumSizeInBytes });
        return { token, urlOptions: { addRandomSuffix: true, maximumSizeInBytes, validUntil } };
      },
    });
    return Response.json(result);
  } catch (e) {
    return Response.json({ message: e instanceof Error ? e.message : "업로드를 준비하지 못했습니다." }, { status: 400 });
  }
}
