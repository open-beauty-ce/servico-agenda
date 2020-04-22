
export type Periodo = {
  comecaEm: Date;
  terminaEm: Date;
}

export class HorarioHelper {

  static horariosChocados(p1: Periodo, p2: Periodo): boolean {
    return (p1.terminaEm > p2.comecaEm && p1.terminaEm < p2.terminaEm)
      || (p1.comecaEm > p2.comecaEm && p1.comecaEm < p2.terminaEm)
      || (p1.comecaEm < p2.comecaEm && p1.terminaEm > p2.terminaEm)
      || (p1.comecaEm > p2.comecaEm && p1.terminaEm < p2.terminaEm)
  }

}
