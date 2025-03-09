import { config } from 'dotenv';
import { type Env, envSchema } from './env.schema';

config();

export default (): Env => {
  const validatedEnv = envSchema.safeParse(process.env);

  if (!validatedEnv.success) {
    console.error(
      '❌ Invalid environment variables:',
      validatedEnv.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  return validatedEnv.data;
};
