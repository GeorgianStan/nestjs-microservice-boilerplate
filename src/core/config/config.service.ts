/**
 * * Dependencies
 */
import { resolve } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConfigService {

  #envPath: any;
  #nodeEnv: string = process.env.NODE_ENV
    ? process.env.NODE_ENV.trim()
    : undefined;

  #envConfig: { [key: string]: string };

  constructor() {
    switch (this.#nodeEnv) {
      case 'test':
        this.#envPath = resolve(process.cwd(), '.env.test');
        break;
      case 'production':
        this.#envPath = resolve(process.cwd(), '.env.production');
        break;
      case 'development':
        this.#envPath = resolve(process.cwd(), '.env.development');
        break;
      default:
        throw new Error('Specify the NODE_ENV variable');
    }

    this.#envConfig = dotenv.parse(fs.readFileSync(this.#envPath));
  }

  get(key: string): string {
    return this.#envConfig[key] || process.env[key];
  }
}
