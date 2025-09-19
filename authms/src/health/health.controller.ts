import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'authms',
      timestamp: new Date().toISOString(),
    };
  }
}
