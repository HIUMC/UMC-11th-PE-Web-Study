import { RequestState } from "../components/movies/request-state";

export default function Loading() {
  return <main className="flex-1 px-5 py-14"><RequestState loading message="페이지를 불러오는 중..." /></main>;
}
