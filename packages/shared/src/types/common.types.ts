import { BaseApiResponseDto } from "../dto";
import { z } from "zod";
import { getByIdSchema } from "../schema";
import { PaginateConfig, PaginateQuery } from 'nestjs-paginate';

type Newable = { new (...args: readonly unknown[]): unknown };
type AnyFn = (...args: unknown[]) => unknown;

export type ClassProperties<C extends Newable> = {
  [K in keyof InstanceType<C> as InstanceType<C>[K] extends AnyFn
    ? never
    : K]: InstanceType<C>[K];
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type NestedTypeKeys<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${NestedTypeKeys<T[K]> extends never ? "" : `.${NestedTypeKeys<T[K]>}`}`;
    }[keyof T]
  : never;

export type ts<T> = PaginateConfig<T>["filterableColumns"]

export type PaginatedSearchQuery = PaginateQuery;

export type BaseApiResponse<T> = InstanceType<typeof BaseApiResponseDto<T>>;

export type GetByIdType = z.infer<typeof getByIdSchema>;

export type BooleanResponseType = boolean;
