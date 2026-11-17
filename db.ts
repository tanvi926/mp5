import { MongoClient } from "mongodb";

const DB_NAME = "mp5-url-shortener";
export const URLS_COLLECTION = "urls";

let clientPromise: Promise<MongoClient> | null = null;

export default async function getCollection(collectionName: string) {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined.");
    }

    // Reuse the connection instead of connecting for every request.
    if (!clientPromise) {
        const client = new MongoClient(uri);

        clientPromise = client.connect().catch((error) => {
            clientPromise = null;
            throw error;
        });
    }

    const client = await clientPromise;

    return client.db(DB_NAME).collection(collectionName);
}