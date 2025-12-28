import { XMarkIcon } from "@heroicons/react/20/solid";
import { navigate } from "astro:transitions/client";
import { useState, type FormEvent } from "react";

const MAX_PACKAGES = 6;

function updateRoute(packages: string[]) {
  const slug = packages.join("+");
  const url = slug ? `/${slug}` : "/";
  navigate(url);
}

export function Input({ packages }: { packages: string[] }) {
  const [input, setInput] = useState("");

  async function handleAddPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) return;
    if (packages.includes(trimmedInput)) return;
    if (packages.length >= MAX_PACKAGES) return;

    updateRoute([...packages, trimmedInput].toSorted());
    setInput("");
  }

  function handleRemovePackage(packageToRemove: string) {
    updateRoute(packages.filter((package_) => package_ !== packageToRemove));
  }

  return (
    <>
      <form onSubmit={(event) => void handleAddPackage(event)}>
        <input
          className="mt-4 h-12 w-full rounded-full border border-zinc-300 px-6 placeholder:text-zinc-600 dark:border-zinc-700 dark:placeholder:text-zinc-400"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a PyPI package..."
          value={input}
        />
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {packages.map((package_) => (
          <div
            className="flex h-12 items-center rounded-full border border-zinc-300 pl-4 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            key={package_}
          >
            {package_}
            <button
              className="grid size-12 cursor-pointer place-items-center rounded-full"
              onClick={() => handleRemovePackage(package_)}
            >
              <XMarkIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
