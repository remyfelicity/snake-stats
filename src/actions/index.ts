import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

const PackageData = z.object({
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

export const server = {
  getPackageData: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      try {
        const response = await fetch(
          `https://pypistats.org/api/packages/${input.name}/overall?mirrors=false`,
        );
        const data = await response.json();
        const parsedData = PackageData.parse(data);
        return parsedData;
      } catch (error) {
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }
    },
  }),
};
