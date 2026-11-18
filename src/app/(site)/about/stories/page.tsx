import type { Metadata } from "next";
import { crumbs, itemList, JsonLd, webPage } from "@/components/sites/injeong/JsonLd";
import { AboutTabs } from "@/components/sites/injeong/AboutTabs";
import { BASE } from "@/components/sites/injeong/base";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { StoryBoard } from "@/components/sites/injeong/StoryBoard";
import { STORY_CATS } from "@/components/sites/injeong/stories";
import { getStories } from "@/lib/injeong/content";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "회사 이야기",
  description: "워크샵과 현장 활동, 행사와 수상 소식까지. ㈜인정건설 사람들이 일하고 함께한 기록입니다.",
  path: "/about/stories",
  image: "/sites/injeong/og/stories.jpg",
});

// pictures shipped with the site sit under /sites and need the base path on the static copy
const pic = (src: string) => (src.startsWith("/sites/") ? `${BASE}${src}` : src);

export default async function StoriesPage() {
  const items = (await getStories()).map((x) => ({ id: x.id, title: x.title, sub: x.sub, cat: x.cat, date: x.date, cover: pic(x.cover) }));
  return (
    <>
      <JsonLd nodes={[webPage("CollectionPage", "/about/stories", "회사 이야기", String(metadata.description), { mainEntity: itemList(items.map((x) => ({ name: x.title, path: `/about/stories/${x.id}` }))) }), crumbs([["회사소개", "/about"], ["회사 이야기", "/about/stories"]])]} />
      <PageHead en="ABOUT" title="회사소개" heading="30년 넘게 충남을 지켜온 종합건설사, 인정건설입니다." desc="1989년 개인 건설업으로 출발해 2003년 종합건설 법인으로 도약하기까지, 타협 없는 공공·산업시설의 엄격한 시공 기준을 모든 민간 현장에 그대로 쏟아붓고 있습니다." img="team.jpg" asH1={false} />
      <AboutTabs />
      <section className="sec stb">
        <div className="container">
          <div className="head">
            <div>
              <h1 className="h2 rv">현장 활동부터 워크샵까지,<br />인정건설 사람들의 기록</h1>
              <p className="lede rv">공사 현장 밖에서 인정건설이 어떻게 일하고, 무엇을 함께하는지 전합니다.</p>
            </div>
          </div>
          <StoryBoard items={items} cats={STORY_CATS} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
