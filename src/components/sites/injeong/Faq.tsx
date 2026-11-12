import Link from "next/link";
import { getProjects } from "@/lib/injeong/content";
import { company } from "./data";

/*
 * 공사 전에 많이 물어보시는 것들: grouped by when the question comes up (상담 → 계약 → 공사 → 준공 → 회사),
 * each answer short and, where a column covers it, a link to read more.
 * Every claim here is one the site already makes elsewhere (data.ts, the home sections); nothing new is promised.
 */
type Qa = { q: string; a: string; more?: { href: string; label: string } };

async function groups(): Promise<{ id: string; title: string; items: Qa[] }[]> {
  const projects = await getProjects();
  const done = projects.filter((p) => !p.ongoing);
  const dongsin = done.filter((p) => p.client === "㈜동신포리마");
  const since = Math.min(...dongsin.map((p) => Number(p.done.slice(0, 4))));
  // the other 시·군 built in, busiest first (홍성 is named on its own as the home base)
  const tally = new Map<string, number>();
  for (const p of projects) if (p.region && p.cat !== "군" && p.region !== "홍성군") tally.set(p.region, (tally.get(p.region) ?? 0) + 1);
  const regions = [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r.replace(/[시군]$/, ""));
  const cap = company.capacity;

  return [
    {
      id: "faq-start",
      title: "상담과 견적",
      items: [
        {
          q: "설계가 끝나기 전에 상담해도 되나요?",
          a: "오히려 그때가 좋습니다. 설비 배치, 인허가, 공정을 설계 전에 함께 정리하면 나중에 설계를 바꾸느라 늘어나는 비용과 기간을 줄일 수 있습니다.",
          more: { href: "/notes/factory-layout", label: "설계 전에 확정해야 할 5가지" },
        },
        {
          q: "도면 없이 평당 공사비를 알 수 있나요?",
          a: "비슷한 실적을 기준으로 대략의 범위는 말씀드릴 수 있습니다. 다만 공사비를 확정하려면 도면을 보고 항목별 내역서로 드려야 합니다. 도면 없이 평당 금액부터 확정해 주는 곳은 계약 뒤에 금액이 바뀌기 쉽습니다.",
          more: { href: "/notes/builder-red-flags", label: "평당 공사비를 먼저 확정해 주는 곳을 경계해야 하는 이유" },
        },
        {
          q: "견적을 빨리 받으려면 무엇을 보내면 되나요?",
          a: "도면(배치도·평면도), 공사 위치, 용도와 대략의 면적, 원하는 준공 시기를 보내 주시면 됩니다. 견적 문의 양식에 도면과 자료를 바로 첨부할 수 있습니다.",
        },
        {
          q: "우리 공장 부지에 증축이 되는지 먼저 봐 주나요?",
          a: "설계 전에 건폐율과 용적률, 주차, 공장등록 변경까지 함께 확인합니다. 땅이 남아 있어도 이 중 하나 때문에 증축이 막히는 경우가 있어, 가장 먼저 보는 항목입니다.",
          more: { href: "/notes/extension-permit", label: "증축 전에 확인할 인허가 5가지" },
        },
      ],
    },
    {
      id: "faq-contract",
      title: "공사비와 계약",
      items: [
        {
          q: "평당 공사비만 보고 시공사를 비교해도 되나요?",
          a: "같은 면적이라도 구조, 용도, 마감, 설비, 부지 조건에 따라 공사비가 크게 달라집니다. 평당 금액보다 항목별 내역서를 나란히 놓고, 무엇이 빠졌는지를 비교하시기를 권합니다.",
          more: { href: "/notes/factory-cost", label: "평당 공사비 밖에서 커지는 비용 5가지" },
        },
        {
          q: "증축은 왜 신축보다 평당 단가가 높나요?",
          a: "기존 건물과 잇는 공사, 좁은 작업 공간, 가동 중인 시설을 지키는 가설 공사가 더해지기 때문입니다. 같은 면적이라도 단가가 달라지는 이유를 견적서에서 항목별로 설명드립니다.",
          more: { href: "/notes/extension-cost", label: "증축 견적서 보는 법" },
        },
        {
          q: "공사 대금은 어떻게 나눠 내나요?",
          a: "계약할 때 공정에 맞춰 나눠 지급하는 일정을 함께 정합니다. 대출을 받아 공사하신다면 대출금이 나오는 시점에 맞춰 일정을 짜야 자금이 모자라지 않습니다.",
          more: { href: "/notes/office-pf", label: "공사비는 맞췄는데 돈이 모자라는 이유" },
        },
        {
          q: "회사의 시공능력과 신용도는 어느 정도인가요?",
          a: `${cap.year}년 시공능력평가액은 ${cap.amount}이고(${cap.rankRegion}, 충남 ${cap.regionTotal}개사 중), 신용등급은 ${company.credit.agency} ${company.credit.grade}입니다. ${company.licenses.map((l) => l.name).join("과 ")} 면허를 보유하고 있습니다.`,
        },
      ],
    },
    {
      id: "faq-build",
      title: "공사 중",
      items: [
        {
          q: "공장을 가동하면서 증축할 수 있나요?",
          a: "착공 전에 작업 구역과 출입 동선, 소음·분진이 나는 작업의 시간대를 정해 두면 가능합니다. 생산 일정과 겹치는 공정은 미리 조정합니다.",
          more: { href: "/notes/extension-live", label: "가동 중 증축에서 착공 전에 정해 둘 6가지" },
        },
        {
          q: "공사가 어떻게 진행되는지 어떻게 알 수 있나요?",
          a: "주공정(CPM) 공정표로 늦어질 수 있는 공정을 미리 챙기고, 공사 진척과 들어간 비용을 건축주께 정기적으로 보고합니다. 문제가 생기면 감추지 않고 먼저 말씀드립니다.",
        },
        {
          q: "현장은 누가 책임지나요?",
          a: `현장소장을 외부 프리랜서에게 맡기지 않고 본사가 직접 관리합니다. 등록 기술자 ${company.engineers}명이 있고, 이 중 특급 기술자가 4명입니다.`,
        },
      ],
    },
    {
      id: "faq-after",
      title: "준공 후",
      items: [
        {
          q: "준공 후에 하자가 생기면 어떻게 하나요?",
          a: "하자보수 보증과 기간은 계약서에 정합니다. 그 기간 안에 접수되면 현장을 확인하고 보수합니다. 누수와 결로처럼 첫 장마와 첫 겨울에 드러나는 하자는 준공 전 점검 항목에 넣어 미리 막습니다.",
          more: { href: "/notes/building-defects", label: "하자가 첫 장마와 첫 겨울에 터지는 이유" },
        },
        {
          q: "준공하면 바로 공장을 돌릴 수 있나요?",
          a: "건물 준공과 생산 시작 사이에는 설비 반입, 시운전, 각종 신고가 남아 있습니다. 그래서 준공일이 아니라 생산을 시작할 날에서 거꾸로 일정을 잡습니다.",
          more: { href: "/notes/factory-handover", label: "생산개시일에서 거꾸로 일정 잡는 법" },
        },
      ],
    },
    {
      id: "faq-company",
      title: "인정건설에 대해",
      items: [
        {
          q: "관급 공사만 하나요? 민간 공사도 맡나요?",
          a: `민간 공사도 맡습니다. 공장과 창고, 교회, 어린이집, 판매·금융 시설을 지었고, ㈜동신포리마는 ${since}년부터 ${dongsin.length}번 공장 공사를 맡겼습니다. 준공 실적은 모두 ${done.length}건입니다.`,
          more: { href: "/projects", label: "시공 실적 전체 보기" },
        },
        {
          q: "어느 지역까지 공사하나요?",
          a: `홍성 본사를 중심으로 ${regions.join("·")} 등 충남 곳곳에서 시공했습니다. 다른 지역은 위치와 규모를 알려 주시면 가능 여부를 먼저 말씀드립니다.`,
          more: { href: "/projects#map", label: "실적 지도 보기" },
        },
        {
          q: "리모델링이나 실내 공사도 하나요?",
          a: "실내건축공사업 면허가 있어 시설 개선과 리모델링도 맡습니다. 지금은 대학병원 시설개선공사를 시공하고 있습니다.",
        },
        {
          q: "회사 자료(지명원)를 받아 볼 수 있나요?",
          a: `면허, 신용평가, 시공능력평가, 실적이 담긴 회사 자료를 보내 드립니다. 견적 문의에 남겨 주시거나 ${company.email}로 요청해 주세요.`,
        },
      ],
    },
  ];
}

export async function Faq() {
  const list = await groups();
  // the same questions for search engines (FAQ rich results)
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.flatMap((g) => g.items).map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
  return (
    <section className="sec" id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="container fq">
        <div className="fq-side">
          <h2 className="h2 rv">공사 전에 많이<br />물어보시는 것들</h2>
          <nav className="fq-nav rv" aria-label="질문 분류">
            {list.map((g) => (
              <a key={g.id} href={`#${g.id}`}>{g.title}<span className="num">{g.items.length}</span></a>
            ))}
          </nav>
          <div className="ask rv">
            <b>찾는 답이 없나요?</b>
            <a className="num" href={`tel:${company.tel}`}>{company.tel}</a>
            <span>{company.email}</span>
          </div>
        </div>
        <div>
          {list.map((g) => (
            <div className="fq-group" id={g.id} key={g.id}>
              <h3 className="fq-h">{g.title}</h3>
              {g.items.map((x) => (
                <details className="rv" key={x.q}>
                  <summary><span className="q">Q</span><span className="t">{x.q}</span><span className="pm" aria-hidden="true" /></summary>
                  <div className="a">
                    <p>{x.a}</p>
                    {x.more && <Link className="fq-more" href={x.more.href}>{x.more.label}</Link>}
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
