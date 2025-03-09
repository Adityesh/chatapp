import { z } from 'zod';

export const envSchema = z.object({
  SESSION_SECRET: z.string(),
  CLOUDINARY_CLOUDNAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_SECRET: z.string(),
  CLIENT_ORIGIN: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  DB_DATABASE: z.string(),
  DB_SCHEMA: z.string(),
  DB_CONNECTION_STRING: z.string(),
  COOKIE_MAXAGE: z.coerce.number().default(3600000),
});

export type Env = z.infer<typeof envSchema>;
