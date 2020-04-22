import * as moment from 'moment';
import { TestingModule } from '@nestjs/testing';
import { ObjectID } from 'mongodb';
import { HorariosService } from './horarios.service';
import { TestHelper } from '../helpers/test.helper';
import { PaginateModel } from 'mongoose';
import { Procedimento } from '../entities/procedimento.entity';
import { Horario } from '../entities/horario.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Doutor } from '../entities/doutor.entity';

const formatoDataHora = 'DD/MM/YYYY HH:mm:ss';

describe('HorariosService', () => {
  let service: HorariosService;
  let procedimentoModel: PaginateModel<Procedimento>;
  const doutor: Doutor = {
    id: 1,
    nome: 'Doutor Teste',
  };

  beforeAll(async () => {
    await TestHelper.startDatabase();
  });

  afterAll(async () => {
    await TestHelper.stopDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await TestHelper.getModule();

    service = module.get<HorariosService>(HorariosService);
    procedimentoModel = module.get<PaginateModel<Procedimento>>(getModelToken('Procedimento'));
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve marcar um horário', async () => {
    const procedimento: Procedimento = new procedimentoModel({
      nome: 'Procedimento Teste',
      duracao: 60,
      doutor,
    });

    await procedimento.save();

    const horario: Horario = await service.marcarHorario({
      procedimentoId: procedimento._id,
      datas: [
        moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
      ],
      doutor,
    });

    expect(horario._id).toBeDefined();
    expect(horario.doutor.nome).toEqual(doutor.nome);
    expect(horario.encontros.length).toEqual(1);
    expect(horario.encontros[0].realizado).toBeFalsy();
  });

  it('deve retornar um erro ao tentar marcar horário conflitante', async () => {
    let horario: Horario;
    const procedimento: Procedimento = new procedimentoModel({
      nome: 'Procedimento Teste',
      duracao: 60,
      doutor,
    });

    await procedimento.save();

    await service.marcarHorario({
      procedimentoId: procedimento._id,
      datas: [
        moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
      ],
      doutor,
    });

    try {
      horario = await service.marcarHorario({
        procedimentoId: procedimento._id,
        datas: [
          moment('12/02/2020 12:30:00', formatoDataHora).toDate(),
        ],
        doutor,
      });
    } catch (e) {
      expect(e.message).toEqual('Horários conflitantes');
    }

    expect(horario).not.toBeDefined();
  });

  it('deve retornar um erro ao tentar marcar um horário de procedimento inexistente', async () => {
    let horario: Horario;

    try {
      horario = await service.marcarHorario({
        procedimentoId: new ObjectID(),
        datas: [
          moment('12/02/2020 12:30:00', formatoDataHora).toDate(),
        ],
        doutor,
      });
    } catch (e) {
      expect(e.message).toEqual('Procedimento não encontrado');
    }

    expect(horario).not.toBeDefined();
  });
});
