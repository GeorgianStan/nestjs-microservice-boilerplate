/**
 * * Dependencies
 */
import { Injectable } from '@nestjs/common';

/**
 * * Implementations
 */

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
