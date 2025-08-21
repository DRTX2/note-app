import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // urls: [process.env.RMQ_URL as string], // url from rabbitMq
        urls: ['amqp://localhost:5672'], // url from rabbitMq
        // queue: process.env.RMQ_QUEUE, // queue name
        queue: 'user_queue', // queue name
        queueOptions: { durable: false }
      }
    },
  );
  await app.listen();
  console.log('UserMS connected to RabbitMQ');
}
bootstrap();
