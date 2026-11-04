import { Areas } from "@/components/sites/injeong/Areas";
import { Case } from "@/components/sites/injeong/Case";
import { Close } from "@/components/sites/injeong/Close";
import { HeroIndex, RecentList } from "@/components/sites/injeong/HeroIndex";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Where } from "@/components/sites/injeong/Where";

export default function Home() {
  return (
    <>
      <HeroIndex />
      <RecentList />
      <Case />
      <Areas />
      <Where />
      <NotesSummary />
      <Close />
    </>
  );
}
