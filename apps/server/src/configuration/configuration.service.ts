import { Injectable } from '@nestjs/common';
import { Env } from './env.schema';
import configuration from './configuration';

@Injectable()
export class ConfigurationService {
  private readonly config: Env;

  constructor() {
    this.config = configuration();
  }

  get<T extends keyof Env>(key: T): Env[T] {
    return this.config[key];
  }
}
