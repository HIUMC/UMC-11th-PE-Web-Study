"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const KEY="umcine-bookmarks";
export default function BookmarkButton({movieId,compact=false}:{movieId:number;compact?:boolean}) {
  const [bookmarked,setBookmarked]=useState(false);
  useEffect(()=>{const timer=setTimeout(()=>{const ids=JSON.parse(localStorage.getItem(KEY)??"[]") as number[];setBookmarked(ids.includes(movieId));},0);return()=>clearTimeout(timer);},[movieId]);
  function toggle(){const ids=JSON.parse(localStorage.getItem(KEY)??"[]") as number[];const next=ids.includes(movieId)?ids.filter(id=>id!==movieId):[...ids,movieId];localStorage.setItem(KEY,JSON.stringify(next));setBookmarked(next.includes(movieId));}
  return <button type="button" onClick={toggle} aria-pressed={bookmarked} aria-label={`북마크 ${bookmarked?"해제":"추가"}`} className={compact?`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border ${bookmarked?"border-blue-600 bg-blue-600":"border-white bg-black/60"}`:"rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"}>
    {compact?<Image src={`/icons/movie-icons/movie-icons/bookmark${bookmarked?"":"-outline"}.svg`} alt="" width={20} height={20} className="invert"/>:bookmarked?"북마크 해제":"북마크 추가"}
  </button>;
}
