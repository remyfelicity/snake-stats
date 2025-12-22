import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  ModuleRegistry,
  NumberAxisModule,
  TimeAxisModule,
  type AgCartesianChartOptions,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { navigate } from "astro:transitions/client";
import { useState, type FormEvent } from "react";
import { type getPackageData } from "../lib/package-data";

ModuleRegistry.registerModules([
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  NumberAxisModule,
  TimeAxisModule,
]);

function updateRoute(packages: string[]) {
  const slug = packages.join("+");
  const url = slug ? `/${slug}` : "/";
  navigate(url);
}

export function App({
  packages,
  packageData,
}: {
  packages: string[];
  packageData: Awaited<ReturnType<typeof getPackageData>>;
}) {
  const [input, setInput] = useState("");
  const [chartOptions, setChartOptions] = useState<AgCartesianChartOptions>({
    axes: { x: { nice: false } },
    data: packageData,
    padding: {
      left: 0,
      right: 0,
    },
    series: packages.map((package_) => ({
      interpolation: { type: "smooth" },
      marker: { enabled: false },
      type: "line",
      xKey: "date",
      yKey: package_,
      yName: package_,
    })),
  });

  async function handleAddPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;
    if (packages.includes(input)) return;

    const newPackages = [...packages, input].toSorted();
    updateRoute(newPackages);
    setInput("");
  }

  function handleRemovePackage(packageToRemove: string) {
    const newPackages = packages.filter(
      (package_) => package_ !== packageToRemove,
    );
    updateRoute(newPackages);
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
      {packages.length === 0 ? null : (
        <AgCharts className="mt-4 h-64 md:h-128" options={chartOptions} />
      )}
    </div>
  );
}
