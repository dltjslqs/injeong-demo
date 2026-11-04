import { Areas } from "@/components/sites/injeong/Areas";
import { Case } from "@/components/sites/injeong/Case";
import { Close } from "@/components/sites/injeong/Close";
import { HeroIndex, RecentList } from "@/components/sites/injeong/HeroIndex";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Team } from "@/components/sites/injeong/Team";
import { Trust } from "@/components/sites/injeong/Trust";
import { PopupModal } from "@/components/sites/injeong/PopupModal";
import { activePopup } from "@/lib/injeong/content";

// 누구이고 무엇을 짓나(분야·실적) → 어떻게 증명하나(동신포리마·감사패) → 누가 짓나(사람) → 왜 다른가(칼럼) → 문의
export default async function Home() {
  const popup = await activePopup();
  return (
    <>
      {popup && <PopupModal popup={popup} />}
      <HeroIndex />
      <Areas />
      <RecentList />
      <Case />
      <Trust />
      <Team />
      <NotesSummary />
      <Close />
    </>
  );
}
