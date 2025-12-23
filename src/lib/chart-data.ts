import { z } from "astro/zod";

const ApiResponseSchema = z.object({
  data: z.array(
    z.object({
      category: z.string(),
      date: z.string(),
      downloads: z.number(),
    }),
  ),
  package: z.string(),
  type: z.string(),
});

async function getPackageData(package_: string) {
  try {
    const response = await fetch(
      `https://pypistats.org/api/packages/${package_}/overall?mirrors=false`,
    );
    if (!response.ok) return null;
    const json = await response.json();
    return ApiResponseSchema.parse(json);
  } catch (_) {
    return null;
  }
}

async function getAllPackageData(packages: string[]) {
  const data = await Promise.all(
    packages.map((package_) => getPackageData(package_)),
  );
  return data.filter((data) => data !== null);
}

export async function getChartData(packages: string[]) {
  const packageData = await getAllPackageData(packages);

  const timeline = new Map<string, Record<string, number>>();
  for (const { package: package_, data } of packageData) {
    for (const { date, downloads } of data) {
      const downloadCounts = timeline.get(date) ?? {};
      downloadCounts[package_] = downloads;
      timeline.set(date, downloadCounts);
    }
  }

  return timeline
    .entries()
    .toArray()
    .map(([date, downloadCounts]) => ({
      date: new Date(date).getTime(),
      ...downloadCounts,
    }));
}

export type ChartData = Awaited<ReturnType<typeof getChartData>>;
