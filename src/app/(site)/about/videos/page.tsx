import { redirect } from "next/navigation";

// the tab became 회사 이야기
export default function VideosMoved() {
  redirect("/about/stories");
}
