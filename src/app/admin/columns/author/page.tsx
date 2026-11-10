import { redirect } from "next/navigation";

// writer profiles moved to each account: 내 정보 for your own, 계정 관리 for the 총괄관리자
export default function AuthorMoved() {
  redirect("/admin/me");
}
