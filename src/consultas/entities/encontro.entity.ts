import { ObjectID } from 'mongodb';

export interface Encontro {
  _id: ObjectID;
  comecaEm: Date;
  terminaEm: Date;
  realizado: boolean;
}
