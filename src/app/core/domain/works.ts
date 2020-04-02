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