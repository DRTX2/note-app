import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('api/health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'userms',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern({ cmd: 'health_check' })
  healthCheck() {
    return {
      status: 'ok',
      service: 'userms',
      timestamp: new Date().toISOString(),
    };
  }
}
