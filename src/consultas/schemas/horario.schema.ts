import { Schema } from 'mongoose';
import { Agenda } from 'descricao-servicos';
import { Horario } from '../entities/horario.entity';
import { UnprocessableEntityException } from '@nestjs/common';
import * as moment from 'moment';
import { Encontro } from '../entities/encontro.entity';
import { HorarioHelper } from '../helpers/horario.helper';
import { Procedimento } from '../entities/procedimento.entity';

export const HorarioSchema = new Schema<Horario>({
  encontros: [{
    comecaEm: {
      type: Date,
      required: [true, 'É necessário informar o horário que começa o procedimento']
    },
    terminaEm: {
      type: Date,
      required: [true, 'É necessário informar o horário que termina o procedimento']
    },
    realizado: {
      type: Boolean,
      default: false
    }
  }],
  doutor: {
    id: {
      type: Schema.Types.Mixed,
      required: [true, 'É necessário informar o identificador do(a) especialista']
    },
    nome: {
      type: String,
      required: [true, 'É necessário informar o nome do(a) especialista']
    }
  },
  procedimentoId: {
    type: Schema.Types.ObjectId,
    required: [true, 'É necessário informar o procedimento']
  }
});

HorarioSchema.virtual('procedimento', {
  ref: 'Procedimento',
  localField: 'procedimentoId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

HorarioSchema.methods.toGRPCMessage = function(): Agenda.Horario {
  return {
    id: this._id.toHexString(),
    procedimentoId: this.procedimentoId.toHexString(),
    encontros: this.encontros.map(encontro => ({
      id: encontro._id.toHexString(),
      data: encontro.comecaEm,
      realizado: encontro.realizado,
    })),
    doutor: this.doutor,
  };
};

HorarioSchema.statics.marcarHorario = async function(dados: Agenda.Input.MarcarHorario, procedimento: Procedimento): Promise<Horario> {
  const periodosAtendimentos = dados.datas.map(data => ({
    inicio: moment(data),
    fim: moment(data).add(procedimento.duracao, 'minutes'),
  }));

  const horarios = await this.find({
    $or: periodosAtendimentos.map(periodo => ({
      'encontros.comecaEm': {
        $gte: moment(periodo.inicio).startOf('day').toDate(),
        $lte: moment(periodo.fim).endOf('day').toDate()
      }
    }))
  });

  if (horarios.length > 0) {
    const periodos = periodosAtendimentos.map(periodo => ({
      comecaEm: periodo.inicio.toDate(),
      terminaEm: periodo.fim.toDate()
    }));
    const encontros: Encontro[] = horarios
      .reduce(
        (encontros, horario) => encontros.concat(horario.encontros),
        []
      );

    const horarioConflitante = encontros.find(encontro =>
      periodos.find(periodo => HorarioHelper.horariosChocados(encontro, periodo))
    )

    if (horarioConflitante) {
      throw new UnprocessableEntityException('Horários conflitantes');
    }
  }

  const horario = new this();

  horario.doutor = dados.doutor;
  horario.procedimentoId = procedimento._id;
  horario.encontros = periodosAtendimentos.map(({inicio, fim}) => ({
    comecaEm: inicio.toDate(),
    terminaEm: fim.toDate()
  }));

  return horario.save();
}
