import { createZodDto } from 'nestjs-zod';
import { getByIdSchema } from '../schema';

export class GetByIdDto extends createZodDto(getByIdSchema) {}