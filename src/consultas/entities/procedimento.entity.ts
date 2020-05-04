import { ObjectID } from 'mongodb';
import { Doutor } from './doutor.entity';
import { Document } from 'mongoose';
import { Agenda, GrpcEntity } from 'descricao-servicos';

export interface Procedimento extends Document, GrpcEntity<Agenda.Procedimento> {
  _id: ObjectID;
  nome: string;
  duracao: number;
  doutor: Doutor;
}
