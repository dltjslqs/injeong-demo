import { Areas } from "@/components/sites/injeong/Areas";
import { Case } from "@/components/sites/injeong/Case";
import { Close } from "@/components/sites/injeong/Close";
import { HeroIndex, RecentList } from "@/components/sites/injeong/HeroIndex";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Team } from "@/components/sites/injeong/Team";
import { Trust } from "@/components/sites/injeong/Trust";
import { Where } from "@/components/sites/injeong/Where";

// 실적 → 자격과 감사패 → 칼럼, then what the company builds and where
export default function Home() {
  return (
    <>
      <HeroIndex />
      <RecentList />
      <Trust />
      <NotesSummary />
      <Areas />
      <Case />
      <Where />
      <Team />
      <Close />
    </>
  );
}
