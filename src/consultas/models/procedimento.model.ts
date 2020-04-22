import { PaginateModel } from 'mongoose';
import { Procedimento } from '../entities/procedimento.entity';

export type ProcedimentoModel = PaginateModel<Procedimento>
