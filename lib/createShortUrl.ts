"use server";

import { MongoServerError } from "mongodb";
import getCollection, { URLS_COLLECTION } from "@/db";

type CreateUrlResult =
    | { success: true; alias: string }
    | { success: false; error: string };

export default async function createShortUrl(
    urlInput: string,
    aliasInput: string
): Promise<CreateUrlResult> {
    // Validate inputs on the server.
    if (
        typeof urlInput !== "string" ||
        typeof aliasInput !== "string"
    ) {
        return {
            success: false,
            error: "Please enter a URL and an alias.",
        };
    }

    const url = urlInput.trim();
    const alias = aliasInput.trim();

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(url);

        if (
            parsedUrl.protocol !== "http:" &&
            parsedUrl.protocol !== "https:"
        ) {
            return {
                success: false,
                error: "Enter a URL beginning with http:// or https://.",
            };
        }
    } catch {
        return {
            success: false,
            error: "Please enter a valid URL, such as https://www.bu.edu.",
        };
    }

    // Keep aliases usable as a single URL path segment.
    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        return {
            success: false,
            error: "Use only letters, numbers, hyphens, or underscores in the alias.",
        };
    }

    try {
        const collection = await getCollection(URLS_COLLECTION);

        // MongoDB also prevents duplicate aliases during simultaneous requests.
        await collection.createIndex(
            { alias: 1 },
            { unique: true }
        );

        const existingUrl = await collection.findOne({ alias });

        if (existingUrl) {
            return {
                success: false,
                error: "That alias is already taken. Please choose another.",
            };
        }

        await collection.insertOne({
            alias,
            url: parsedUrl.href,
        });

        return {
            success: true,
            alias,
        };
    } catch (error) {
        console.error("Failed to create shortened URL:", error);

        if (
            error instanceof MongoServerError &&
            error.code === 11000
        ) {
            return {
                success: false,
                error: "That alias is already taken. Please choose another.",
            };
        }

        return {
            success: false,
            error: "Unable to create the shortened URL. Please try again.",
        };
    }
}