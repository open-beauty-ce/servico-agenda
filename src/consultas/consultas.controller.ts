import { Controller, NotFoundException } from '@nestjs/common';
import { Agenda, Common } from 'descricao-servicos';
import { GrpcMethod } from '@nestjs/microservices';
import { HorariosService } from './services/horarios.service';
import { Horario } from './entities/horario.entity';
import { HorarioModel } from './models/horario.model';
import { InjectModel } from '@nestjs/mongoose';
import { ProcedimentoModel } from './models/procedimento.model';
import { Procedimento } from './entities/procedimento.entity';

@Controller('consultas')
export class ConsultasController {

  constructor(
    private readonly horariosService: HorariosService,
    @InjectModel('Horario')
    private readonly horarioModel: HorarioModel,
    @InjectModel('Procedimento')
    private readonly procedimentoModel: ProcedimentoModel,
  ) {
  }

  @GrpcMethod('HorarioController', 'marcarHorario')
  async marcarHorario(dados: Agenda.Input.MarcarHorario): Promise<Agenda.Horario> {
    const horario: Horario = await this.horariosService.marcarHorario(dados);

    return horario.toGRPCMessage();
  }

  @GrpcMethod('HorarioController', 'listarHorarios')
  async listarHorarios(opcoes: Agenda.Input.FiltroHorarios): Promise<Agenda.Horarios> {
    const horarios = await this.horarioModel.paginate(opcoes.filtro, {
      limit: opcoes.paginacao.limite,
      page: opcoes.paginacao.pagina,
      sort: opcoes.ordenacao,
    });

    return {
      pagina: horarios.page,
      paginas: horarios.pages,
      total: horarios.total,
      itens: horarios.docs.map((horario) => horario.toGRPCMessage()),
    };
  }

  @GrpcMethod('HorarioController', 'pegarHorario')
  async pegarHorario(filtro: Common.Input.FiltroPeloId): Promise<Agenda.Horario> {
    const horario = await this.horarioModel.findById(filtro.id);

    if (!horario) {
      throw new NotFoundException('Horário não encontrado');
    }

    return horario.toGRPCMessage();
  }

  @GrpcMethod('HorarioController', 'excluirHorario')
  async excluirHorario(filtro: Common.Input.FiltroPeloId): Promise<Common.SituacaoExclusao> {
    const horario = await this.horarioModel.deleteOne({
      _id: filtro.id,
    });

    return {
      sucesso: horario.deletedCount > 0,
    };
  }

  @GrpcMethod('ProcedimentoController', 'criarProcedimento')
  async criarProcedimento(dados: Agenda.Input.CriarProcedimento): Promise<Agenda.Procedimento> {
    const procedimento: Procedimento = new this.procedimentoModel(dados);

    await procedimento.save();

    return procedimento.toGRPCMessage();
  }

  @GrpcMethod('ProcedimentoController', 'listarProcedimentos')
  async listarProcedimentos(opcoes: Agenda.Input.FiltroProcedimentos): Promise<Agenda.Procedimentos> {
    const procedimentos = await this.procedimentoModel.paginate(opcoes.filtro, {
      limit: opcoes.paginacao.limite,
      page: opcoes.paginacao.pagina,
      sort: opcoes.ordenacao,
    });

    return {
      pagina: procedimentos.page,
      paginas: procedimentos.pages,
      total: procedimentos.total,
      itens: procedimentos.docs.map((procedimento) => procedimento.toGRPCMessage()),
    };
  }

  @GrpcMethod('ProcedimentoController', 'pegarProcedimento')
  async pegarProcedimento(filtro: Common.Input.FiltroPeloId): Promise<Agenda.Procedimento> {
    const procedimento = await this.procedimentoModel.findById(filtro.id);

    if (!procedimento) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    return procedimento.toGRPCMessage();
  }

  @GrpcMethod('ProcedimentoController', 'excluirProcedimento')
  async excluirProcedimento(filtro: Common.Input.FiltroPeloId): Promise<Common.SituacaoExclusao> {
    const procedimento = await this.procedimentoModel.deleteOne({
      _id: filtro.id,
    });

    return {
      sucesso: procedimento.deletedCount > 0,
    };
  }
}
