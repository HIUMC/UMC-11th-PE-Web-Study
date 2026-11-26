import { notFound } from "next/navigation";
import { DetailPage } from "../../../App";
export default async function Page({params}:{params:Promise<{id:string}>}) { const {id} = await params; if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id)<=0) notFound(); return <DetailPage id={Number(id)}/>; }

