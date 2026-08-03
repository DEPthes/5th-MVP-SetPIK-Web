import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-shell page-shell--centered" aria-labelledby="not-found-title">
      <h1 className="text-heading-1" id="not-found-title">
        페이지를 찾을 수 없어요.
      </h1>
      <Link className="button page-action" to="/">
        홈으로 돌아가기
      </Link>
    </section>
  );
}
