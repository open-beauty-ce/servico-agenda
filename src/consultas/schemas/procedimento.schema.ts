import { Schema } from 'mongoose';

export const ProcedimentoSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'É becessparui informar o nome do procedimento']
  },
  duracao: {
    type: Number,
    required: [true, 'É necessário informar a duração do procedimentos']
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
