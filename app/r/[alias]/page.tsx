import { notFound, redirect } from "next/navigation";
import getCollection, { URLS_COLLECTION } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RedirectPageProps = {
    params: Promise<{ alias: string }>;
};

export default async function RedirectPage({
                                               params,
                                           }: RedirectPageProps) {
    const { alias } = await params;

    const collection = await getCollection(URLS_COLLECTION);
    const savedUrl = await collection.findOne({ alias });

    if (!savedUrl || typeof savedUrl.url !== "string") {
        notFound();
    }

    redirect(savedUrl.url);
}