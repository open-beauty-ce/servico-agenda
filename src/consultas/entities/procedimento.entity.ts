import { ObjectID } from 'mongodb';
import { Doutor } from './doutor.entity';
import { Document } from 'mongoose';

export interface Procedimento extends Document {
  _id: ObjectID;
  nome: string;
  duracao: number;
  doutor: Doutor;
}
