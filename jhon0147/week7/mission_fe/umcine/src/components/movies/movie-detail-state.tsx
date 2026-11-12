import { Link } from "@tanstack/react-router";
import { RequestState, type RequestStateProps } from "./request-state";

export function MovieDetailState(props: RequestStateProps) {
  return (
    <main className="flex-1 bg-[#f6f8fb] px-5 py-14">
      <section className="mx-auto max-w-3xl">
        <RequestState {...props} />
        <Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700" to="/">영화 목록으로 돌아가기</Link>
      </section>
    </main>
  );
}
