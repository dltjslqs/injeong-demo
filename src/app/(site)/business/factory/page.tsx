import type { Metadata } from "next";
import Link from "next/link";
import { coverOf } from "@/components/sites/injeong/ColumnArticle";
import { BusinessTabs } from "@/components/sites/injeong/BusinessTabs";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { company, projectAlt, projectImg } from "@/components/sites/injeong/data";
import { company as companyRef, crumbs, itemList, JsonLd, webPage } from "@/components/sites/injeong/JsonLd";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { getColumns, getProjects } from "@/lib/injeong/content";
import { ORIGIN, pageMeta } from "@/lib/injeong/site";
import { Photo } from "@/components/sites/injeong/Photo";

const DESCRIPTION = "충남 홍성 ㈜인정건설의 공장 신축·증축. 2008년부터 같은 기업 공장을 이어 지은 실적, 가동 중 증축, 부지 검토부터 공장등록까지의 진행 순서와 공장주가 먼저 묻는 질문을 정리했습니다.";

export const metadata: Metadata = pageMeta({
  title: "충남 공장 신축·증축",
  description: DESCRIPTION,
  path: "/business/factory",
  image: "/sites/injeong/og/factory.jpg",
});

// the columns a factory owner reads, in the order the work goes
const COLUMN_SLUGS = ["factory-site", "factory-cost", "factory-layout", "factory-handover", "extension-permit", "extension-cost", "extension-live"];

// answers taken from those columns; each links to the column that explains it
const FAQ: { q: string; a: string; slug: string }[] = [
  { q: "공장 공사비, 평당 얼마로 잡으면 되나요?", a: "평당 공사비만으로는 부족합니다. 부지 조성, 기계 하중을 버티는 바닥, 전력 인입, 보관물에 따른 소방, 크레인과 물류동선처럼 건물 본체 밖에서 커지는 비용이 있어서, 처음부터 총사업비표로 잡아야 합니다.", slug: "factory-cost" },
  { q: "부지를 사기 전에 무엇을 확인해야 하나요?", a: "내 업종의 공장이 들어설 수 있는 땅인지, 도로와 대지의 높이 차이, 땅속 상태, 전기·상수도·오수를 실제로 쓸 수 있는지, 대형 화물차가 드나들 수 있는지를 계약 전에 순서대로 봐야 합니다.", slug: "factory-site" },
  { q: "설비 배치가 다 안 정해졌는데 설계를 시작해도 되나요?", a: "기계의 무게 범위와 대략적인 위치, 전력 규모, 크레인 유무는 설계 전에 정해야 합니다. 제조사나 세부 모델은 나중에 정해도 됩니다.", slug: "factory-layout" },
  { q: "생산을 멈추지 않고 증축할 수 있나요?", a: "할 수 있습니다. 대신 어디까지 멈출 수 있는지, 진동·분진·소음 관리, 공사 차량과 생산 물류의 분리, 전기·소방·용수를 언제 몇 시간 끊는지를 착공 전에 정해 둬야 합니다.", slug: "extension-live" },
  { q: "증축도 허가를 받아야 하나요?", a: "증축은 건축허가나 신고 대상입니다. 바닥면적 85㎡ 이내 증축이나 공업지역·산업단지 안의 2층 이하·연면적 500㎡ 이하 공장은 건축신고 대상이 될 수 있고, 그 밖에는 허가 절차를 밟는다고 보시는 게 안전합니다.", slug: "extension-permit" },
];

const STEPS: [string, string][] = [
  ["부지·입지 검토", "용도지역과 업종 제한, 도로 높이와 진입로, 전기·상수도·오수 사용 가능 여부를 먼저 확인합니다."],
  ["설비 배치 확정", "기계의 무게와 위치, 크레인 용량, 전력 규모를 정해 바닥·기초·골조 설계에 반영합니다."],
  ["설계·인허가", "일정은 준공일이 아니라 생산개시일에서 거꾸로 잡습니다. 건축허가와 함께 공장설립 승인, 소방·환경 절차가 각각 언제 끝나야 하는지 한 장의 공정표에 넣습니다."],
  ["시공", "가동 중인 공장이라면 공정표를 생산 계획표 위에 겹쳐 그리고, 접속 공사는 생산이 덜 몰리는 날에 잡습니다."],
  ["사용승인·공장등록", "설비 반입과 시운전 일정에 맞춰 사용승인부터 공장등록까지 마무리합니다."],
];

export default async function FactoryPage() {
  const projects = await getProjects();
  const factories = projects.filter((p) => p.cat === "산업" && !p.ongoing);
  const withPic = factories.filter((p) => projectImg(p)).slice(0, 6);
  const dongsin = factories.filter((p) => p.client === "㈜동신포리마");
  const dongsinSince = dongsin.reduce((y, p) => Math.min(y, Number(p.done.slice(0, 4)) || y), 9999);
  const dongsinExt = dongsin.filter((p) => p.name.includes("증축")).length;
  const columns = await getColumns();
  const cols = COLUMN_SLUGS.map((s) => columns.find((c) => c.slug === s)).filter((c) => c !== undefined);
  const faqLd = {
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const service = {
    "@type": "Service",
    "@id": `${ORIGIN}/business/factory#service`,
    name: "공장 신축·증축 공사",
    serviceType: "공장 신축·증축",
    provider: companyRef,
    areaServed: { "@type": "AdministrativeArea", name: "충청남도" },
  };
  return (
    <>
      <JsonLd nodes={[webPage("WebPage", "/business/factory", "공장 신축·증축", DESCRIPTION, { mainEntity: service }), itemList(factories.map((p) => ({ name: p.name }))), faqLd, crumbs([["사업 분야", "/business"], ["산업시설", "/business/factory"]])]} />
      <PageHead
        en="FACTORY"
        title="산업시설"
        heading="충남 공장·창고 신축과 증축, 부지 검토부터 공장등록까지 책임집니다"
        desc={`${dongsinSince}년부터 ㈜동신포리마의 공장 공사를 ${dongsin.length}번 맡았습니다.`}
        img="p18"
      />
      <BusinessTabs />

      <section className="fx-band">
        <div className="container">
          <div className="fx-panel rv">
          <ul className="fx-figs">
            <li><b className="num">{factories.length}<small>건</small></b><span>공장·창고 준공 실적</span></li>
            <li><b className="num">{dongsin.length}<small>번</small></b><span>㈜동신포리마 공장 공사({dongsinSince}~)</span></li>
            <li><b className="num">{company.capacity.amount.replace("억", "")}<small>억</small></b><span>{company.capacity.year} 시공능력평가 ({company.capacity.rankRegion})</span></li>
          </ul>
          <div className="btns fx-act">
            <Link className="btn cta" href={`/contact?type=${encodeURIComponent("공장·창고")}`}>공장 견적 문의</Link>
            <a className="btn line num" href={`tel:${company.tel}`}>{company.tel}</a>
          </div>
            <ul className="fx-cred">
              <li>기업신용평가 <b>{company.credit.grade}</b> <span>{company.credit.agency}, {company.credit.until}까지</span></li>
              <li>등록 기술자 <b>{company.engineers}명</b></li>
              <li>특급 기술자 <b>{company.crew.find((c) => c.label === "특급 기술자")?.count}명</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sec soft" id="works">
        <div className="container">
          <div className="head">
            <div>
              <h2 className="h2 rv">이런 공장을 지었습니다</h2>
              <p className="lede rv">공장과 자재창고, 자원순환시설까지 준공한 {factories.length}건입니다. 발주처와 연면적을 그대로 적었습니다. 공사 금액은 확인된 것만 적었습니다.</p>
            </div>
            <Link className="link rv" href={`/projects?cat=${encodeURIComponent("산업")}#works`}>시공 실적에서 보기</Link>
          </div>
          <div className="pf">
            {withPic.map((w) => (
              <article className="rv" key={w.id}>
                <div className="im"><Photo src={projectImg(w)} alt={projectAlt(w)} width={1800} height={1344} loading="lazy" decoding="async" /></div>
                <div className="bd">
                  <h3>{w.name}</h3>
                  <dl>
                    <dt>발주처</dt><dd title={w.client}>{w.client}</dd>
                    <dt>규모</dt><dd title={w.scale}>{w.scale || "—"}</dd>
                    <dt>연면적</dt><dd className="num">{w.area ?? "—"}</dd>
                    <dt>공사비</dt><dd className="num">{w.cost ?? "—"}</dd>
                    <dt>준공</dt><dd className="num">{w.done}</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
          <div className="rl">
            <h3 className="rl-h">공장·창고 준공 실적 전체</h3>
            <div className="rl-wrap">
              <table>
                <thead><tr><th scope="col">준공</th><th scope="col">공사명</th><th scope="col">발주처</th><th scope="col">규모</th><th scope="col">연면적</th></tr></thead>
                <tbody>
                  {factories.map((p) => (
                    <tr key={p.id}>
                      <td className="num">{p.done}</td>
                      <th scope="row">{p.name}</th>
                      <td>{p.client}</td>
                      <td>{p.scale}</td>
                      <td className="num">{p.area ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container fx-live">
          <div>
            <h2 className="h2 rv">가동 중인 공장 옆에서도 짓습니다</h2>
            <p className="lede rv">㈜동신포리마는 {dongsinSince}년부터 공장과 자재창고 공사를 {dongsin.length}번 맡겼고, 그중 {dongsinExt}건이 기존 공장에 붙여 짓는 증축이었습니다. 증축은 생산 일정과 같이 움직여야 해서, 공정표를 공장의 생산 계획표 위에 겹쳐 그리고 멈추는 시간을 미리 정합니다.</p>
            <Link className="link rv" href="/notes/extension-live">가동 중 증축에서 미리 정할 6가지</Link>
          </div>
          <ul className="fx-list rv">
            {dongsin.slice(0, 6).map((p) => (
              <li key={p.id}><span className="num">{p.done.slice(0, 4)}</span><b>{p.name.replace("㈜동신포리마 ", "")}</b>{p.area && <span className="num">{p.area}</span>}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec soft" id="process">
        <div className="container">
          <div className="head"><div><h2 className="h2 rv">공장 공사는 이 순서로 갑니다</h2></div></div>
          <ol className="flow">
            {STEPS.map(([t, d]) => (
              <li className="rv" key={t}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="container fq">
          <div className="fq-side">
            <h2 className="h2 rv">공장주가 먼저<br />물어보시는 것들</h2>
            <div className="ask rv">
              <b>더 궁금하신 점은 전화로</b>
              <a className="num" href={`tel:${company.tel}`}>{company.tel}</a>
              <span>{company.hours.days} {company.hours.open}~{company.hours.close}</span>
            </div>
          </div>
          <div>
            {FAQ.map((x) => (
              <details className="rv" key={x.q}>
                <summary><span className="q">Q</span><span className="t">{x.q}</span><span className="pm" aria-hidden="true" /></summary>
                <div className="a">
                  <p>{x.a}</p>
                  <Link className="fq-more" href={`/notes/${x.slug}`}>자세히 읽기</Link>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {cols.length > 0 && (
        <section className="sec soft">
          <div className="container">
            <div className="head">
              <div><h2 className="h2 rv">공장 짓기 전에 읽어 볼 칼럼</h2></div>
              <Link className="link rv" href="/notes">기술 칼럼 전체</Link>
            </div>
            <ul className="nf-grid">
              {cols.map((c) => (
                <li key={c.slug}>
                  <Link href={`/notes/${c.slug}`} className="nf-card">
                    <span className="nf-pic"><Photo src={coverOf(c)} alt={`${c.title} 대표 이미지`} width={800} height={500} loading="lazy" /></span>
                    <span className="nf-meta"><span>{c.cat}</span></span>
                    <b className="nf-t">{c.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand sub={"부지 가계약 전이신가요?\n입지 검토부터 공장등록 일정까지 현장 실무진이 직접 짚어드립니다."} href={`/contact?type=${encodeURIComponent("공장·창고")}`} />
    </>
  );
}
