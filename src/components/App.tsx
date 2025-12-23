import { XMarkIcon } from "@heroicons/react/20/solid";
import { navigate } from "astro:transitions/client";
import { useState, type FormEvent } from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartData } from "../lib/chart-data";

const CHART_LINE_COLORS = [
  "oklch(58.8% 0.158 241.966)",
  "oklch(66.6% 0.179 58.318)",
  "oklch(59.6% 0.145 163.225)",
  "oklch(58.6% 0.253 17.585)",
];

function updateRoute(packages: string[]) {
  const slug = packages.join("+");
  const url = slug ? `/${slug}` : "/";
  navigate(url);
}

export function App({
  packages,
  chartData,
}: {
  packages: string[];
  chartData: ChartData;
}) {
  const [input, setInput] = useState("");

  async function handleAddPackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;
    if (packages.includes(input)) return;
    if (packages.length >= 4) return;

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
      <h1 className="text-2xl font-thin">PyPI Trends</h1>
      <form onSubmit={(event) => void handleAddPackage(event)}>
        <input
          className="mt-4 h-12 w-full rounded-full border border-gray-300 px-6 placeholder:font-light placeholder:text-gray-500"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a PyPI package..."
          value={input}
        />
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {packages.map((package_, i) => (
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
        <LineChart
          className="mt-8 h-96 w-full md:h-128"
          data={chartData}
          responsive
        >
          <CartesianGrid />
          <Legend />
          <XAxis
            dataKey="_date"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(date) =>
              new Intl.DateTimeFormat("en-US", {
                day: "2-digit",
                month: "short",
              }).format(new Date(date))
            }
            type="number"
          />
          <YAxis
            tickFormatter={(downloadCount) =>
              new Intl.NumberFormat("en-US", {
                compactDisplay: "short",
                notation: "compact",
              }).format(downloadCount)
            }
            width={48}
          />
          {packages.map((package_, i) => (
            <Line
              dataKey={package_}
              dot={false}
              key={package_}
              name={package_}
              stroke={CHART_LINE_COLORS[i]}
              strokeWidth="2"
              type="monotone"
            />
          ))}
        </LineChart>
      )}
    </div>
  );
}
