import { NotFoundBody } from "@/components/sites/injeong/NotFoundBody";

export const metadata = { title: "페이지를 찾을 수 없습니다" };

/** A missing column, project or story: inside the site layout, which already has the header and footer. */
export default function NotFound() {
  return <NotFoundBody />;
}
