import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProcedimentoSchema } from '../schemas/procedimento.schema';
import { HorarioSchema } from '../schemas/horario.schema';
import { HorariosService } from '../services/horarios.service';
import { AppModule } from '../../app.module';
import { ConsultasController } from '../consultas.controller';
import { HorarioModel } from '../models/horario.model';
import { ProcedimentoModel } from '../models/procedimento.model';
import { Connection } from 'mongoose';

const mongod = new MongoMemoryServer({
  instance: {
    auth: false,
    dbName: 'appointment',
    port: 27018,
  },
  autoStart: false,
});

export class TestHelper {

  private static module: TestingModule;

  static async getModule(): Promise<TestingModule> {
    if (!this.module) {
      this.module = await Test.createTestingModule({
        imports: [
          AppModule,
          MongooseModule.forFeature([
            {
              name: 'Procedimento',
              schema: ProcedimentoSchema,
            },
            {
              name: 'Horario',
              schema: HorarioSchema,
            },
          ]),
        ],
        controllers: [ConsultasController],
        providers: [HorariosService],
      }).compile();
    }

    return this.module;
  }

  static async startDatabase(): Promise<void> {
    await mongod.start();
  }

  static async stopDatabase(): Promise<void> {
    const module: TestingModule = await this.getModule();
    const connection: Connection = await module.get<Connection>(getConnectionToken());

    await connection.close();
    await mongod.stop();
  }

  static async clearDatabase(): Promise<void> {
    const module: TestingModule = await this.getModule();
    const procedimentoModel: ProcedimentoModel = module.get<ProcedimentoModel>(getModelToken('Procedimento'));
    const horarioModel: HorarioModel = module.get<HorarioModel>(getModelToken('Horario'));

    await Promise.all([
      horarioModel.deleteMany({}),
      procedimentoModel.deleteMany({}),
    ]);
  }
}
