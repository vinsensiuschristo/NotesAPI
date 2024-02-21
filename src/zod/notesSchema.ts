import { z } from 'zod'

export const zodNotesSchema = z.object({
  name: z.string(),
  year: z.number(),
  author: z.string(),
  summary: z.string(),
  publisher: z.string(),
  pageCount: z.number(),
  readPage: z.number(),
  reading: z.boolean()
}).strict()
