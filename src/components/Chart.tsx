import { Select } from "@headlessui/react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { type ChartData } from "../lib/chart-data";

const LINE_COLORS = [
  "oklch(62.3% 0.214 259.815)",
  "oklch(63.7% 0.237 25.331)",
  "oklch(72.3% 0.219 149.579)",
  "oklch(66.7% 0.295 322.15)",
  "oklch(79.5% 0.184 86.047)",
  "oklch(71.5% 0.143 215.221)",
] as const;

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(label!));
  return (
    <div className="rounded border border-zinc-300 bg-zinc-100 p-2 shadow dark:border-none dark:bg-zinc-700">
      <p className="font-medium">{formattedDate}</p>
      {payload.map((entry) => {
        const formattedDownloadCount = new Intl.NumberFormat("en-US").format(
          entry.value,
        );
        return (
          <p className="flex gap-1" key={entry.name}>
            <span style={{ color: entry.stroke }}>{entry.name}</span>
            {formattedDownloadCount}
          </p>
        );
      })}
    </div>
  );
}

export function Chart({
  data,
  packages,
}: {
  data: ChartData;
  packages: string[];
}) {
  const [range, setRange] = useState(180);
  const dataSlice = data.slice(-range);

  if (packages.length === 0) return null;
  return (
    <div className="mt-8 rounded-xl border border-zinc-300 p-4 dark:border-none dark:bg-zinc-800">
      <div>
        <label className="text-lg" htmlFor="range">
          Downloads in the past
        </label>
        <Select
          className="ml-1 text-lg"
          id="range"
          name="range"
          onChange={(event) => setRange(Number(event.target.value))}
          value={range}
        >
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={180}>180 days</option>
        </Select>
      </div>
      <LineChart
        className="mt-4 h-96 w-full md:h-128"
        data={dataSlice}
        responsive
      >
        <CartesianGrid />
        <Legend />
        <Tooltip content={CustomTooltip} />
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
            stroke={LINE_COLORS[i]}
            strokeWidth="2"
            type="monotone"
          />
        ))}
      </LineChart>
    </div>
  );
}
