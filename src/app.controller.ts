/**
 * * Dependencies
 */
import { Controller, Logger } from '@nestjs/common';

/**
 *  * Implementations
 */
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
