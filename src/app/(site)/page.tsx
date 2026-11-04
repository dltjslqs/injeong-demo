import { Areas } from "@/components/sites/injeong/Areas";
import { Case } from "@/components/sites/injeong/Case";
import { Close } from "@/components/sites/injeong/Close";
import { HeroIndex, RecentList } from "@/components/sites/injeong/HeroIndex";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Team } from "@/components/sites/injeong/Team";
import { Trust } from "@/components/sites/injeong/Trust";
import { Where } from "@/components/sites/injeong/Where";
import { PopupModal } from "@/components/sites/injeong/PopupModal";
import { activePopup } from "@/lib/injeong/content";

// 실적 → 자격과 감사패 → 칼럼, then what the company builds and where
export default async function Home() {
  const popup = await activePopup();
  return (
    <>
      {popup && <PopupModal popup={popup} />}
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
