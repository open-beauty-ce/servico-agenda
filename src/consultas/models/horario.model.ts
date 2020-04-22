import { PaginateModel } from 'mongoose';
import { Horario } from '../entities/horario.entity';
import { Agenda } from 'descricao-servicos';
import { Procedimento } from '../entities/procedimento.entity';

export interface HorarioModel extends PaginateModel<Horario> {
  marcarHorario(dados: Agenda.Input.MarcarHorario, procedimento: Procedimento): Promise<Horario>;
}
