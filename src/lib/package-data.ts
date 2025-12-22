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

async function getPypiPackageData(package_: string) {
  try {
    const url = `https://pypistats.org/api/packages/${package_}/overall?mirrors=false`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const rawData = await response.json();
    const parsedData = ApiResponseSchema.parse(rawData);
    return parsedData;
  } catch (_) {
    return null;
  }
}

export async function getPackageData(packages: string[]) {
  const allPackageData = (
    await Promise.all(packages.map((package_) => getPypiPackageData(package_)))
  ).filter((data) => data !== null);

  const packageDataByDate = new Map<string, Record<string, number>>();
  for (const packageData of allPackageData) {
    for (const record of packageData.data) {
      packageDataByDate.set(record.date, {
        ...(packageDataByDate.get(record.date) ?? {}),
        [packageData.package]: record.downloads,
      });
    }
  }

  const aggregatedPackageData = packageDataByDate
    .entries()
    .toArray()
    .map(([date, downloadRecord]) => ({
      date: new Date(date).getTime(),
      ...downloadRecord,
    }));
  return aggregatedPackageData;
}
