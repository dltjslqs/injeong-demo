import type { Metadata } from "next";
import { FieldPage } from "@/components/sites/injeong/FieldPage";
import { FIELDS } from "@/components/sites/injeong/fields";
import { pageMeta } from "@/lib/injeong/site";

const f = FIELDS.private;

export const metadata: Metadata = pageMeta({ title: f.label, description: f.description, path: f.path, image: "/sites/injeong/og/private.jpg" });

export default function Page() {
  return <FieldPage f={f} />;
}
