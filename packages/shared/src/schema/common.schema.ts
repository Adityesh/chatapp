import { z } from 'zod';

export const getByIdSchema = z.object({
  id: z.number().positive().finite().min(1)
})