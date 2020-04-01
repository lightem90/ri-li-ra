import {NumberInput, TextInput, DisabledInput} from "./common"

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

//Nodo che rappresenta un parametro della lavorazione (t. piazzamento etc..)
export class TreeWorkNode {

  public name : string = ""
  public editable : boolean
  public inputs : NumberInput []= []
  public outputs : DisabledInput[]= []
  public children : TreeWorkNode[]= []
}
//nodo che rappresenta una lavorazione o uno stage "chiuso" nell'alber
export class TreeWorkFlatNode {
  
  public name : string = ""
  level: number = 0
  expandable: boolean
  public inputs : NumberInput[] = []
  public outputs : DisabledInput[] = []
}

export class WorkStage {
  constructor(
    public workType : WorkType,
    public optionalTimes :  OptionalStageValue[] = [],
    public uid: string = "",
    public name : string = "",
    public mm : number = 0,
    public piece_count : number = 0,
    public steps : number = 0,
    public mm_min : number = 0,
    public tot_minutes : number = 0,
    public total_price : number = 0) {

  }
}

export class OptionalStageValue {

  constructor(
    public name: string,
    public value : number = 0) {  }
}

export class ToolChangeStage {
  constructor(public uid : string = "",
    public mm : number = 0,
    public count : number = 0,
    public mm_min : number = 0,
    public tot_minutes : number = 0,
    public total_price : number = 0) {

  }
}

export class FixedWorkTimes {
  
  constructor(
    public name: string = "",
    public value : number = 0) {  }
}

//Uso una work per tutte le lavorazioni
export class Work {
  constructor(
    public workType : WorkType,
    public uid: string = "",
    public fixedTimes : FixedWorkTimes[] = [],
    public toolChangePhase : ToolChangeStage = new ToolChangeStage(),
    public stages : WorkStage[] = [],
    public pricePerPiece : number = 0,
    public charge : number = 0,
    public totalPrice : number = 0) {

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