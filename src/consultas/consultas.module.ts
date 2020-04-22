import { Module } from '@nestjs/common';
import { ConsultasController } from './consultas.controller';
import { HorariosService } from './services/horarios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcedimentoSchema } from './schemas/procedimento.schema';
import { HorarioSchema } from './schemas/horario.schema';

@Module({
  imports: [
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
})
export class ConsultasModule {
}
