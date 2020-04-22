import { ObjectID } from 'mongodb';
import { Encontro } from './encontro.entity';
import { Doutor } from './doutor.entity';
import { Document } from 'mongoose';

export interface Horario extends Document {
  _id: ObjectID;
  encontros: Encontro[];
  doutor: Doutor;
  procedimentoId: ObjectID;
}
