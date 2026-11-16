import { redirect } from "next/navigation";

// 이야기 moved into 회사소개 as the 걸어온 길 tab
export default function StoryMoved() {
  redirect("/about/story");
}
