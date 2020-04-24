import { ObjectID } from 'mongodb';
import { Doutor } from './doutor.entity';
import { Document } from 'mongoose';
import { Agenda } from 'descricao-servicos';
import { GrpcEntity } from './grpc.entity';

export interface Procedimento extends Document, GrpcEntity<Agenda.Procedimento> {
  _id: ObjectID;
  nome: string;
  duracao: number;
  doutor: Doutor;
}
