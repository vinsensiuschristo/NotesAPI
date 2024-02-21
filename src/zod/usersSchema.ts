import { z } from 'zod'

export const userRegisterValidation = z.object({
  nim: z.string().min(7).max(8),
  email: z.string().email(),
  password: z.string(),
  name: z.string().max(50)
}).strict()
