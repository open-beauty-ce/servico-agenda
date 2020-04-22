import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultasModule } from './consultas/consultas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongoosePaginate from 'mongoose-paginate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        console.log(config.get('MONGODB_URI'))
        return {
          uri: config.get('MONGODB_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectionFactory(connection) {
            connection.plugin(MongooseAutopopulate);
            connection.plugin(MongoosePaginate);
            return connection;
          }
        }
      },
      inject: [ConfigService]
    }),
    ConsultasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
