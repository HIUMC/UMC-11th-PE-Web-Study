"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function SearchForm({initial=""}:{initial?:string}){const [query,setQuery]=useState(initial);const router=useRouter();function submit(e:FormEvent){e.preventDefault();const value=query.trim();router.push(value?`/search?query=${encodeURIComponent(value)}`:"/search");}return <form onSubmit={submit} className="flex h-12 items-center rounded-lg border border-gray-300 bg-white px-4 shadow-sm"><Image src="/icons/movie-icons/movie-icons/search.svg" alt="" width={20} height={20} className="mr-3 opacity-60"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="검색어" placeholder="영화 제목을 검색하세요" className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><button className="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white">검색</button></form>}
