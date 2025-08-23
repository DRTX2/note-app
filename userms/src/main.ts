import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
  urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq-ms:5672'],
  queue: process.env.RABBITMQ_QUEUE || 'user_queue',
        queueOptions: { durable: false }
      }
    },
  );
  await app.listen();
  console.log('UserMS connected to RabbitMQ');
}
bootstrap();
