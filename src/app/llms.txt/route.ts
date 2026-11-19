import { company } from "@/components/sites/injeong/data";
import { getColumns, getProjects } from "@/lib/injeong/content";
import { LIVE, ORIGIN } from "@/lib/injeong/site";

export const revalidate = 3600;

/** A plain-text map of the site for AI assistants (llmstxt.org): who the company is and where the answers are. */
export async function GET() {
  if (!LIVE) return new Response("Not found", { status: 404 });
  const done = (await getProjects()).filter((p) => !p.ongoing).length;
  const columns = await getColumns();
  const u = (p: string) => `${ORIGIN}${p}`;
  const body = [
    `# ${company.name}`,
    "",
    `> 충남 홍성의 종합건설사. 1989년 개인 건설업으로 시작해 2003년 법인으로 전환했고, 공장 신축·증축과 민간·실내건축, 공공·군 시설, 교육시설을 시공한다. 2004년 이후 준공 실적 ${done}건, ${company.capacity.year}년 시공능력평가 ${company.capacity.amount}(${company.capacity.rankRegion}).`,
    "",
    `- 주소: ${company.address}`,
    `- 전화: ${company.tel} (${company.hours.days} ${company.hours.open}~${company.hours.close})`,
    `- 면허: ${company.licenses.map((l) => `${l.name} ${l.no}`).join(", ")}`,
    `- 네이버 플레이스: ${company.naverPlace}`,
    "",
    "## 사업 분야",
    `- [산업시설: 공장 신축·증축](${u("/business/factory")})`,
    `- [민간·실내건축](${u("/business/private")})`,
    `- [공공·군 시설](${u("/business/public")})`,
    `- [교육시설](${u("/business/education")})`,
    "",
    "## 회사와 실적",
    `- [회사소개](${u("/about")})`,
    `- [걸어온 길](${u("/about/story")})`,
    `- [시공 실적 ${done}건과 지역 지도](${u("/projects")})`,
    `- [견적 문의와 자주 묻는 질문](${u("/contact")})`,
    "",
    "## 기술 칼럼",
    ...columns.map((c) => `- [${c.title}](${u(`/notes/${c.slug}`)}): ${c.sub}`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
