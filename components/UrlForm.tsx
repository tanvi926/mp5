"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import createShortUrl from "@/lib/createShortUrl";

export default function UrlForm() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [error, setError] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setShortUrl("");
        setLoading(true);

        try {
            const result = await createShortUrl(url, alias);

            if (!result.success) {
                setError(result.error);
                return;
            }

            // Works on localhost and on the deployed website.
            setShortUrl(
                `${window.location.origin}/r/${result.alias}`
            );
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card">
            <h1>URL Shortener</h1>
            <p className="intro">
                Enter a website URL and choose a custom alias.
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="url">Website URL</label>
                <input
                    id="url"
                    name="url"
                    type="text"
                    inputMode="url"
                    placeholder="https://www.bu.edu"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    required
                />

                <label htmlFor="alias">Custom alias</label>
                <input
                    id="alias"
                    name="alias"
                    type="text"
                    placeholder="bu"
                    value={alias}
                    onChange={(event) => setAlias(event.target.value)}
                    aria-describedby="alias-help"
                    required
                />

                <p id="alias-help" className="hint">
                    Use letters, numbers, hyphens, or underscores.
                    Aliases are case-sensitive.
                </p>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Shorten URL"}
                </button>
            </form>

            {error && (
                <p className="error" role="alert">
                    {error}
                </p>
            )}

            {shortUrl && (
                <div className="result" aria-live="polite">
                    <label htmlFor="short-url">
                        Your shortened URL
                    </label>

                    <input
                        id="short-url"
                        type="text"
                        value={shortUrl}
                        readOnly
                        onFocus={(event) =>
                            event.currentTarget.select()
                        }
                    />

                    <p className="hint">
                        Select the link above and copy it to share.
                    </p>

                    <a href={shortUrl}>Open shortened URL</a>
                </div>
            )}
        </section>
    );
}