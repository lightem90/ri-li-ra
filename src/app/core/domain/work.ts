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
    public uid : string = "",
    public originalWorkName : string = "",
    public name : string = "",
    public costo_totale : number = 0,
    public costo_orario : number = 0,
    public tempo_totale : number = 0,
    public tempo_attrezzaggio : number = 0,
    public tempo_piazzamento : number = 0,
    public tempo_programma : number = 0,
    public fasi : Stage[] = null) {
      this.fasi = []
  }

  //inizializza un TreeWorkNode con i dati della lavorazione, il tree work node deve essere già stato inizializzato
  static mapTo(w: Work, node: TreeWorkNode) {
    if (node.isWork) {
      node.originalWorkName = w.originalWorkName
      node.name = w.name
      node.totTime.value = w.tempo_totale
      let tmpD = node.outputs.find(out => out.label === WorkConstant.work.tot_price_id)
      if (tmpD) {
        tmpD.text = w.costo_orario.toFixed(2)
      }
      let tmp = node.inputs.find(i => i.label === WorkConstant.work.hourly_price_id)
      if (tmp) {
        tmp.text = w.costo_orario.toFixed(2)
      }
      tmp = node.inputs.find(i => i.label === WorkConstant.work.placement_time_id)
      if (tmp) {
        tmp.text = w.tempo_piazzamento.toFixed(2)
      }
      tmp = node.inputs.find(i => i.label === WorkConstant.work.program_time_id)
      if (tmp) {
        tmp.text = w.tempo_programma.toFixed(2)
      }
      tmp = node.inputs.find(i => i.label === WorkConstant.work.tooling_time_id)
      if (tmp) {
        w.tempo_attrezzaggio = tmp.value
      }

      if (w.fasi && w.fasi.length > 0) {
        const stages = node.children.filter(c => c.name !== "")
        for (let index = 0; index < stages.length; index++) {   
          let workChild = node.children[index] 
          let stage = w.fasi[index]
          stage.mapTo(workChild)               
        }    
      } else {
        //non ci sono nodi salvati per le fasi, quindi li rimuovo dall'albero
        node.children = node.children.filter(c => !c.isStage)
      }
    }
    return w
  }

  //inizializza la lavorazione dal TreeWorkNode
  public mapFrom(node: TreeWorkNode) : Work {    
    if (node.isWork) {
      this.name = node.name
      this.originalWorkName = node.originalWorkName
      this.tempo_totale = node.totTime.value

      let tmpD = node.outputs.find(out => out.label === WorkConstant.work.tot_price_id)
      if (tmpD) {
        this.costo_orario = +(tmpD.text)
      }

      let tmp = node.inputs.find(i => i.label === WorkConstant.work.hourly_price_id)
      if (tmp) {
        this.costo_orario = tmp.value
      }
      
      tmp = node.inputs.find(i => i.label === WorkConstant.work.placement_time_id)
      if (tmp) {
        this.tempo_piazzamento = tmp.value
      }
      
      tmp = node.inputs.find(i => i.label === WorkConstant.work.program_time_id)
      if (tmp) {
        this.tempo_programma = tmp.value
      }
      
      tmp = node.inputs.find(i => i.label === WorkConstant.work.tooling_time_id)
      if (tmp) {
        this.tempo_attrezzaggio = tmp.value
      }

      for(let child of node.children.filter(c => c.isStage)){
        var stage = new Stage()
        stage.mapFrom(child)
        this.fasi.push(stage)
      }
    }

    return this
  }
}

//siccome le fasi hanno campi diversi inizializzo una property bag
export class Stage {
  
  constructor(
    public uid : string = "",
    public name : string = "",
    public property_bag : {[key: string]: number} = null) {
      this.property_bag = {}     
  }

  //inizializza un TreeWorkNode con i dati della lavorazione
  public mapTo(node: TreeWorkNode) : Stage {
    if (node.isStage) {

      console.log("MAPPING NODE FROM STAGE: " + this.name)
      node.name = this.name
      for(const prop in this.property_bag) {
        const propName = WorkConstant.stage[prop]
        console.log("Property name: " + propName)
        let validIn = node.inputs.find(inp => inp.label === propName)
        if (validIn) {
          console.log("Input: " + i + " value: " + validIn.value)
          validIn.value = this.property_bag[prop]
        }

        let validOut = node.outputs.find(out => out.label === propName)
        if (validOut) {
          console.log("Output: " + i + " value: " + validOut.text)
          validOut.text = (this.property_bag[prop]).toFixed(2)
        }
      }
    }
    console.log("END MAPPING")
    return this
  }

  //inizializza la lavorazione dal TreeWorkNode
  mapFrom(node: TreeWorkNode) : Stage {
    if (node.isStage) {
      console.log("MAPPING STAGE FROM NODE: " + node.name)
      this.name = node.name

      for(let i in WorkConstant.stage) {
        const propName = WorkConstant.stage[i]
        console.log("Property name: " + propName)
        let validIn = node.inputs.find(inp => inp.label === propName)
        if (validIn) {
          console.log("Input: " + i + " value: " + validIn.value)
          this.property_bag[i] = validIn.value
        }

        let validOut = node.outputs.find(out => out.label === propName)
        if (validOut) {
          console.log("Output: " + i + " value: " + validOut.text)
          this.property_bag[i] = +(validOut.text)
        }
      }
    }
    console.log("END MAPPING")
    return this;    
  }
}

export class ExternalWork {
  constructor(
    public uid : string = "",
    public name : string = "",
    public quantita : number = 0,
    public costo_unitario : number = 0,
    public ricarico_percentuale : number = 0,
    public costo_totale : number = 0) {   }

  //inizializza la lavorazione dal TreeWorkNode
  public mapFrom(node: TreeWorkNode) : ExternalWork {

    this.name = node.name

    let tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.quantity_id)
    if (tmp){
      this.quantita = tmp.value
    }
    tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.unitary_price_id)
    if (tmp){
      this.costo_unitario = tmp.value
    }
    tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.charge_perc_id)
    if (tmp){
      this.ricarico_percentuale = tmp.value
    }
    
    let otmp = node.outputs.find(i => i.label === WorkConstant.ext_work.tot_price_id)
    if (otmp){
      this.costo_totale = +(otmp.text)
    }

    return this;
  }
  
  //inizializza un TreeWorkNode con i dati della lavorazione
  static mapTo(w: ExternalWork, node: TreeWorkNode) : ExternalWork{
      node.name = w.name

      let tmpD = node.outputs.find(out => out.label === WorkConstant.ext_work.tot_price_id)
      if (tmpD) {
        tmpD.text = w.costo_totale.toFixed(2)
      }
      
      let tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.quantity_id)
      if (tmp) {
        tmp.value = w.quantita
      }
      tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.unitary_price_id)
      if (tmp) {
        tmp.value = w.costo_unitario
      }
      tmp = node.inputs.find(i => i.label === WorkConstant.ext_work.charge_perc_id)
      if (tmp) {
        tmp.value = w.ricarico_percentuale
      }

      return w
  }
}
