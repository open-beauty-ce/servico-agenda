import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Horario } from '../entities/horario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Procedimento } from '../entities/procedimento.entity';
import { Agenda } from 'descricao-servicos';
import { HorarioModel } from '../models/horario.model';
import { ProcedimentoModel } from '../models/procedimento.model';

@Injectable()
export class HorariosService {

  constructor(
    @InjectModel('Horario')
    private horarioModel: HorarioModel,
    @InjectModel('Procedimento')
    private procedimentoModel: ProcedimentoModel
  ) {}

  async marcarHorario(dados: Agenda.Input.MarcarHorario): Promise<Horario> {
    const procedimento: Procedimento = await this.procedimentoModel.findById(dados.procedimentoId);

    if (!procedimento) {
      throw new UnprocessableEntityException('Procedimento não encontrado');
    }

    return this.horarioModel.marcarHorario(dados, procedimento);
  }
}
