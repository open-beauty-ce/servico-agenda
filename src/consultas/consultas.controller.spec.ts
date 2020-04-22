import * as moment from 'moment';
import { TestingModule } from '@nestjs/testing';
import { ConsultasController } from './consultas.controller';
import { TestHelper } from './helpers/test.helper';
import { ProcedimentoModel } from './models/procedimento.model';
import { getModelToken } from '@nestjs/mongoose';
import { Procedimento } from './entities/procedimento.entity';
import { Agenda } from 'descricao-servicos';

const formatoDataHora = 'DD/MM/YYYY HH:mm:ss';

describe('Consultas Controller', () => {
  let controller: ConsultasController;
  let procedimentoModel: ProcedimentoModel;

  beforeAll(async () => {
    await TestHelper.startDatabase();
  });

  afterAll(async () => {
    await TestHelper.stopDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.getModule();

    controller = module.get<ConsultasController>(ConsultasController);
    procedimentoModel = module.get<ProcedimentoModel>(getModelToken('Procedimento'));
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve marcar horário', async () => {
    const procedimento: Procedimento = new procedimentoModel({
      nome: 'Procedimento Teste',
      duracao: 60,
      doutor: {
        id: 1,
        nome: 'Doutor Teste'
      }
    });

    await procedimento.save();

    const horario: Agenda.Horario = await controller.marcarHorario({
      doutor: {
        id: "1",
        nome: 'Doutor Teste'
      },
      datas: [
        moment('12/02/2020 12:00:00', formatoDataHora).toDate()
      ],
      procedimentoId: procedimento._id
    });

    expect(horario.encontros.length).toEqual(1);
  });
});
