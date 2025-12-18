import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState, type FormEvent } from "react";

export function App() {
  const [input, setInput] = useState("");
  const [packages, setPackages] = useState<string[]>([]);

  async function handleAddPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInput("");
    if (!packages.includes(input)) {
      setPackages([...packages, input].toSorted());
    }
  }

  function handleRemovePackage(packageToRemove: string) {
    setPackages(packages.filter((package_) => package_ !== packageToRemove));
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-xl font-thin">Snake Stats</h1>
      <form onSubmit={(event) => void handleAddPackage(event)}>
        <input
          className="mt-4 h-16 w-full rounded-full border border-gray-300 px-6 text-lg outline-offset-1 outline-blue-500 placeholder:font-light placeholder:text-gray-500"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a PyPI package..."
          value={input}
        />
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {packages.map((package_) => (
          <div
            className="flex h-12 items-center rounded-full border border-gray-300 pl-4 text-gray-700"
            key={package_}
          >
            {package_}
            <button
              className="grid size-12 cursor-pointer place-items-center rounded-full"
              onClick={() => handleRemovePackage(package_)}
            >
              <XMarkIcon className="size-5 text-gray-500" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
