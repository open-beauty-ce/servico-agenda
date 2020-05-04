import { ObjectID } from 'mongodb';
import { Encontro } from './encontro.entity';
import { Doutor } from './doutor.entity';
import { Document } from 'mongoose';
import { Agenda, GrpcEntity } from 'descricao-servicos';

export interface Horario extends Document, GrpcEntity<Agenda.Horario> {
  _id: ObjectID;
  encontros: Encontro[];
  doutor: Doutor;
  procedimentoId: ObjectID;
}
