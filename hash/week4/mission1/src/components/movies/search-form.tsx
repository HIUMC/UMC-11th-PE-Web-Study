import { useNavigate } from "@tanstack/react-router";
import { useRef, useState, type SubmitEvent } from "react";

interface SearchFormProps {
  initialQuery: string;
  buttonLabel?: string;
}

export default function SearchForm({
  initialQuery,
  buttonLabel = "검색",
}: SearchFormProps) {
  const [searchText, setSearchText] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate({ from: "/search" });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    void navigate({
      to: "/search",
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
    inputRef.current?.focus();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-xl border border-[#dce2ee] bg-white p-2 pl-4 shadow-sm focus-within:border-[#4765df]"
    >
      <img
        src="/icons/search.svg"
        alt=""
        className="h-5 w-5 shrink-0"
      />

      <input
        ref={inputRef}
        type="text"
        name="query"
        aria-label="영화 검색어"
        placeholder="예: 스파이더맨"
        autoComplete="off"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca3af]"
      />

      {searchText.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md hover:bg-gray-100"
        >
          <img
            src="/icons/close.svg"
            alt=""
            className="h-5 w-5"
          />
        </button>
      )}

      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-lg bg-[#191c23] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#353a45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]"
      >
        {buttonLabel}
      </button>
    </form>
  );
}