export enum WorkType {
  Taglio,
  Sbavatura,
  Fresatura,
  Tornitura,
  RettificaVerticale,
  RettificaTangenziale,
  Stozzatura,
  Dentatura,
  Sabbiatura,
  Saldatura,
  IncisioneLaser,
  ControlloQualita
}

export class WorkStage {
  constructor(public uid: string = "",) {

  }
}

export class ToolChangePhase {
  constructor(public uid : string = "") {

  }
}

//Uso una work per tutte le lavorazioni
export class Work {
  constructor(
    public uid: string = "",
    public workType : WorkType = null,
    public toolChangePhase : ToolChangePhase = null,
    public stages : WorkStage[] = [],
    public pricePerPiece : number = 0,
    public charge : number = 0,
    public totalPrice : number = 0,
    public fixedTimes : number[] = []) {

    }

}

export enum ThermalWorkType {
  Cementazione,
  Carbonitrurazione,
  Tempra
}

export enum SuperficialWorkType {
  Verniciatura,
  Anodizzazione,
  AnodizzazioneDura,
  Micropallinatura,
  Sabbiatura,
  Brunitura,
  CromaturaEstetica,
  CromaturaSpessore,
  SuperLattice,
  Zincatura
}

export enum ExternalWorkType {
  Rettifica,
  Piegatura,
  TaglioLaser
}

//generica lavorazione esterna, il "tipo mi serve solo per la grafica"
export class ExternalWork {

  constructor(
    public uid : string = "",
    public eType : ExternalWorkType = null,
    public sType : SuperficialWorkType = null,
    public tType : ThermalWorkType = null,
    public measureUnit : string = "",
    public pricePerPiece : number = 0,
    public charge : number = 0,
    public totalPrice : number = 0) {

    }

}