import AIGenerator from "@/components/AIGenerator";
import ProductForm from "@/components/ProductForm";
import { Sparkles } from "@/components/icons";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30">
          <Sparkles className="size-3.5" /> Powered by OpenAI
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Write better,{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
            faster
          </span>
        </h1>
        <p className="max-w-xl text-base text-stone-600 dark:text-stone-400">
          Generate content from a prompt, or create a ready-to-publish product
          description in one click.
        </p>
      </header>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <AIGenerator />
        <ProductForm />
      </div>
    </main>
  );
}
