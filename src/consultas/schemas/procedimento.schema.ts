import { Schema } from 'mongoose';
import { Procedimento } from '../entities/procedimento.entity';
import { Agenda } from 'descricao-servicos';

export const ProcedimentoSchema = new Schema<Procedimento>({
  nome: {
    type: String,
    required: [true, 'É becessparui informar o nome do procedimento'],
  },
  duracao: {
    type: Number,
    required: [true, 'É necessário informar a duração do procedimentos'],
  },
  doutor: {
    id: {
      type: Schema.Types.Mixed,
      required: [true, 'É necessário informar o identificador do(a) especialista']
    },
    nome: {
      type: String,
      required: [true, 'É necessário informar o nome do(a) especialista']
    }
  }
});

ProcedimentoSchema.methods.toGRPCMessage = function(): Agenda.Procedimento {
  return {
    id: this._id.toHexString(),
    nome: this.nome,
    duracao: this.duracao,
    doutor: this.doutor,
  };
};
