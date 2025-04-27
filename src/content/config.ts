import { defineCollection, z } from "astro:content";

const cardinalsCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    country: z.string(),
    age: z.number(),
    title: z.string(),
    created_cardinal: z.string(),
    voting_history: z.array(z.string()).optional(),
    papal_probability: z.number().min(0).max(1).optional(),
    image: z.string(),
    tags: z.array(z.string()).optional(),
    is_papabile: z.boolean().optional(),
  }),
});

export const collections = {
  cardinals: cardinalsCollection,
};
