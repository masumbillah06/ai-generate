"use client";

import { useState } from "react";
import { Sparkles, Spinner } from "@/components/icons";

const PRODUCT_NAME = "Wireless Headphones";
const FEATURES = ["Bluetooth 5.3", "Noise cancellation", "40-hour battery"];

export default function ProductForm() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateDescription() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "/api/ai/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: PRODUCT_NAME,
            features: FEATURES,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setDescription(data.description);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <header>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Product description
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Turn product details into polished marketing copy.
        </p>
      </header>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          Product
        </p>
        <p className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-50">
          {PRODUCT_NAME}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={generateDescription}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? (
          <>
            <Spinner /> Generating...
          </>
        ) : (
          <>
            <Sparkles /> Generate with AI
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="AI-generated description..."
          rows={6}
          className="w-full resize-y rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
        />
      </div>
    </section>
  );
}
