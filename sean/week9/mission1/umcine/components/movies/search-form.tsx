"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

interface SearchFormProps {
  /** 현재 URL의 검색어. 이 값이 바뀌면 입력창도 맞춥니다. */
  query: string;
  submitLabel: string;
  placeholder?: string;
}

/**
 * useSearch/useNavigate(TanStack Router) 대신 useRouter(next/navigation)로
 * `/search?query=...`에 push 합니다. 검색어는 URL이 들고 있고,
 * 실제 검색은 Server Component가 그 값으로 수행합니다.
 */
export function SearchForm({ query, submitLabel, placeholder }: SearchFormProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(query);

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    router.push(nextQuery ? `/search?query=${encodeURIComponent(nextQuery)}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl border border-neutral-300 p-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ml-2 h-5 w-5" src="/icons/search.svg" alt="" />
      <input
        aria-label="검색어"
        placeholder={placeholder}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="flex-1 px-1 py-2 text-base outline-none"
      />
      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
