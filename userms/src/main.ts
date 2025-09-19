import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Crear una aplicación HTTP para CORS y endpoints REST
  const httpApp = await NestFactory.create(AppModule);

  // Configuración CORS para la aplicación HTTP
  httpApp.enableCors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Iniciar el servidor HTTP
  await httpApp.listen(process.env.HTTP_PORT ?? 3000);
  console.log(
    `UserMS HTTP server running on port ${process.env.HTTP_PORT ?? 3000}`,
  );

  // Crear microservicio RabbitMQ
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq-ms:5672'],
        queue: process.env.RABBITMQ_QUEUE || 'user_queue',
        queueOptions: { durable: false },
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
  );
  await app.listen();
  console.log('UserMS connected to RabbitMQ');
}
bootstrap();
