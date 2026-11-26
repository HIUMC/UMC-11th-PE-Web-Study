import type { NextRequest } from "next/server";
import { requestTmdb } from "../../../../lib/server/tmdb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  try {
    const response = await requestTmdb(path.join("/"), request.nextUrl.searchParams, request.signal);
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ message: "영화 서버에 연결하지 못했어요." }, { status: 502 });
  }
}
