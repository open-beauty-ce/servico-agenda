import * as moment from 'moment';
import { HorarioHelper, Periodo } from './horario.helper';

const formatoDataHora = 'DD/MM/YYYY HH:mm:ss';

describe('HorarioHelper', () => {

  describe('Horários conflitantes', () => {

    /*
     * P1:  C           T
     *      |-----------|
     * P2:        C           T
     *            |-----------|
     */
    it('deve reclamar do horário inicial do procedimento', () => {
      const p1: Periodo = {
        comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
      };
      const p2: Periodo = {
        comecaEm: moment('12/02/2020 12:30:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 13:30:00', formatoDataHora).toDate(),
      };

      const horariosConflitantes = HorarioHelper.horariosChocados(p1, p2);

      expect(horariosConflitantes).toBeTruthy();
    });

    /*
     * P1:        C           T
     *            |-----------|
     * P2:  C           T
     *      |-----------|
     */
    it('deve reclamar que a duração do procedimento choca com outro horário', () => {
      const p1: Periodo = {
        comecaEm: moment('12/02/2020 12:30:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 13:30:00', formatoDataHora).toDate(),
      };
      const p2: Periodo = {
        comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
      };

      const horariosConflitantes = HorarioHelper.horariosChocados(p1, p2);

      expect(horariosConflitantes).toBeTruthy();
    });

    /*
     * P1:  C                     T
     *      |---------------------|
     * P2:        C           T
     *            |-----------|
     */
    it('deve reclamar que o horário de um procedimento está dentro de outro muito longo', () => {
      const p1: Periodo = {
        comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 15:00:00', formatoDataHora).toDate(),
      };
      const p2: Periodo = {
        comecaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 14:00:00', formatoDataHora).toDate(),
      };

      const horariosConflitantes = HorarioHelper.horariosChocados(p1, p2);

      expect(horariosConflitantes).toBeTruthy();
    });

    /*
     * P1:        C           T
     *            |-----------|
     * P2:  C                     T
     *      |---------------------|
     */
    it('deve reclamar que o horário de um procedimento muito longo choca com outro menor', () => {
      const p1: Periodo = {
        comecaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 14:00:00', formatoDataHora).toDate(),
      };
      const p2: Periodo = {
        comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
        terminaEm: moment('12/02/2020 15:00:00', formatoDataHora).toDate(),
      };

      const horariosConflitantes = HorarioHelper.horariosChocados(p1, p2);

      expect(horariosConflitantes).toBeTruthy();
    });

  });

  describe('Horários não conflitantes', () => {

    /*
     * P1:  C           T
     *      |-----------|
     * P2:                  C           T
     *                      |-----------|
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * P1:                  C           T
     *                      |-----------|
     * P2:  C           T
     *      |-----------|
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * P1:  C           T
     *      |-----------|
     * P2:              C           T
     *                  |-----------|
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * P1:              C           T
     *                  |-----------|
     * P2:  C           T
     *      |-----------|
     */
    it('não deve conflitar nenhum horário', () => {
      const horarios = [
        {
          p1: {
            comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
          },
          p2: {
            comecaEm: moment('12/02/2020 13:30:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 14:30:00', formatoDataHora).toDate(),
          }
        },
        {
          p1: {
            comecaEm: moment('12/02/2020 13:30:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 14:30:00', formatoDataHora).toDate(),
          },
          p2: {
            comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
          }
        },
        {
          p1: {
            comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
          },
          p2: {
            comecaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 14:00:00', formatoDataHora).toDate(),
          }
        },
        {
          p1: {
            comecaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 14:00:00', formatoDataHora).toDate(),
          },
          p2: {
            comecaEm: moment('12/02/2020 12:00:00', formatoDataHora).toDate(),
            terminaEm: moment('12/02/2020 13:00:00', formatoDataHora).toDate(),
          }
        },
      ];

      const horariosConflitantes = horarios.filter(({p1, p2}) => HorarioHelper.horariosChocados(p1, p2));

      expect(horariosConflitantes.length).toEqual(0);
    });

  });

});
