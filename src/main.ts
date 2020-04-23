import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'agenda',
      url: '0.0.0.0:5000',
      protoPath: join(__dirname, '../node_modules/descricao-servicos/proto/agenda.proto'),
    }
  });
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
