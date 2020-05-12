import {NumberInput, TextInput, DisabledInput} from "./common"

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

  //todo map to/from nodo
}