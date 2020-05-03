import {NumberInput, TextInput, DisabledInput, TreeWorkNode} from "./common"

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

export class WorkConstant { 

  //{ [key: string]: boolean}
  public static ext_work = {
    quantity_id : 'qty',
    unitary_price_id : 'unitaryPrice',
    charge_perc_id : 'PercRic',
    tot_price_id : 'totPrice'
  }

  public static work = {
    tot_price_id : 'totPrice',
    tot_minutes_id : 'wMinutes',
    hourly_price_id : 'wPriceH',
    placement_time_id : 'wTPiaz',
    program_time_id : 'wTProg',
    tooling_time_id : 'wTAtt'
  }

  public static stage = {
    time_id : 'sMinutes',
    price_id : 'sPrice',
    piece_count_id : 'nPiece',
    step_count_id : 'nStep',
    vel_id : 'mVel',
    dist_id : 'mMm',
    //cambio utensile
    tc_step_id : 'nStepCmUt',
    tc_vel_id : 'mVelCmUt',
    tc_dist_id : 'mMmCmUt',
    tc_name_id : 'cmUt',
    //controllo qualità
    cc_distz_id : 'mm_z',
    cc_stepz_id : 'p_z',
    cc_velz_id : 'v_z',
    //taglio
    t_area_id : 't_area',
    t_resa_id : 't_resa',
    t_vel_id : 'taglioSec',
    //tornitura
    tor_giri_min_id : 'tor_giri_min',
    tor_mm_giro_id : 'tor_mm_giro',
    tor_vel_min_id : 'tornMMin',
  }
}

//lavorazione salvata su db
export class Work {

  constructor(
    uid : string = "",
    name : string = "",
    costo_totale : number = 0,
    costo_orario : number = 0,
    tempo_totale : number = 0,
    tempo_attrezzaggio : number = 0,
    tempo_piazzamento : number = 0,
    tempo_programma : number = 0,
    fasi : Stage[] = []) {

  }

  //inizializza un TreeWorkNode con i dati della lavorazione
  mapTo(node: TreeWorkNode) {
    if (node.isWork) {

    }
    return this
  }

  //inizializza la lavorazione dal TreeWorkNode
  mapFrom(node: TreeWorkNode) {    
    if (node.isWork) {

    }
  }
}

//siccome le fasi hanno campi diversi inizializzo una property bag
export class Stage {
  
  constructor(
    uid : string = "",
    name : string = "",
    property_bag : {[key: string]: boolean} = {}) {      
      
  }

  //inizializza un TreeWorkNode con i dati della lavorazione
  mapTo(node: TreeWorkNode) {
    if (node.isStage) {

    }
    return this
  }

  //inizializza la lavorazione dal TreeWorkNode
  mapFrom(node: TreeWorkNode) {
    if (node.isStage) {

    }    
  }
}
