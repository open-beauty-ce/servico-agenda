import { Controller } from '@nestjs/common';
import { Agenda } from 'descricao-servicos';
import { GrpcMethod } from '@nestjs/microservices';
import { HorariosService } from './services/horarios.service';
import { Horario } from './entities/horario.entity';
import { HorarioModel } from './models/horario.model';
import { InjectModel } from '@nestjs/mongoose';
import { ProcedimentoModel } from './models/procedimento.model';

@Controller('consultas')
export class ConsultasController {

  constructor(
    private readonly horariosService: HorariosService,
    @InjectModel('Horario')
    private readonly horarioModel: HorarioModel,
    @InjectModel('Procedimento')
    private readonly procedimentoModel: ProcedimentoModel
  ) {}

  @GrpcMethod('HorarioController', 'marcarHorario')
  async marcarHorario(dados: Agenda.Input.MarcarHorario): Promise<Agenda.Horario> {
    const horario: Horario = await this.horariosService.marcarHorario(dados);

    return {
      id: horario._id,
      encontros: horario.encontros.map((encontro) => ({
        id: encontro._id,
        data: encontro.comecaEm,
        realizado: encontro.realizado
      })),
      doutor: horario.doutor,
      procedimentoId: `${horario.procedimentoId}`
    }
  }

  @GrpcMethod('HorarioController', 'listarProcedimentos')
  async listarProcedimentos(filtro: Agenda.Input.FiltroProcedimentos): Promise<Agenda.Procedimentos> {
    const procedimentos = await this.procedimentoModel.paginate(filtro);

    return {
      pagina: procedimentos.page,
      paginas: procedimentos.pages,
      total: procedimentos.total,
      itens: procedimentos.docs.map((procedimento) => ({
        id: procedimento._id,
        duracao: procedimento.duracao,
        doutor: procedimento.doutor,
        nome: procedimento.nome
      }))
    }
  }
}
