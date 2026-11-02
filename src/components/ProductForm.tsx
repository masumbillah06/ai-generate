"use client";

import { useState } from "react";
import { Sparkles, Spinner } from "@/components/icons";

const TONES = ["professional", "friendly", "luxury", "playful", "technical"];

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-indigo-500 focus:bg-white focus:text-stone-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

const labelClass = "text-sm font-medium text-stone-700 dark:text-stone-300";

export default function ProductForm() {
  const [productName, setProductName] = useState("Wireless Headphones");
  const [features, setFeatures] = useState([
    "Bluetooth 5.3",
    "Noise cancellation",
    "40-hour battery",
  ]);
  const [featureDraft, setFeatureDraft] = useState("");
  const [tone, setTone] = useState("professional");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addFeatures(raw: string) {
    const added = raw
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f && !features.includes(f));

    if (added.length) setFeatures([...features, ...added]);
    setFeatureDraft("");

    return added.length ? [...features, ...added] : features;
  }

  function removeFeature(feature: string) {
    setFeatures(features.filter((f) => f !== feature));
  }

  async function generateDescription(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Include a half-typed feature so it isn't silently dropped.
    const allFeatures = addFeatures(featureDraft);

    if (!productName.trim() || allFeatures.length === 0) {
      setError("Enter a product name and at least one feature.");
      return;
    }

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
            productName: productName.trim(),
            features: allFeatures,
            tone,
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
    <form
      onSubmit={generateDescription}
      className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
    >
      <header>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Product description
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Turn product details into polished marketing copy.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="productName" className={labelClass}>
          Product name
        </label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. Wireless Headphones"
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="feature" className={labelClass}>
          Features
        </label>
        {features.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 py-1 pl-3 pr-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  aria-label={`Remove ${feature}`}
                  className="grid size-4 place-items-center rounded-full text-sm leading-none transition hover:bg-indigo-200/70 dark:hover:bg-indigo-400/20"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            id="feature"
            type="text"
            value={featureDraft}
            onChange={(e) => setFeatureDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeatures(featureDraft);
              }
            }}
            placeholder="Type a feature and press Enter"
            maxLength={200}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => addFeatures(featureDraft)}
            disabled={!featureDraft.trim()}
            className="shrink-0 rounded-xl border border-stone-300 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tone" className={labelClass}>
          Tone
        </label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className={`${inputClass} capitalize`}
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
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
          className="w-full resize-y rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:text-stone-900 focus:ring-indigo-500/15 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
        />
      </div>
    </form>
  );
}
