import { Injectable } from '@angular/core';

import {WorkType, WorkConstant, Stage, Work} from '../domain/work'
import {NumberInput, TextInput, DisabledInput, 
        TreeWorkNode,  TreeWorkFlatNode, IWorkFactoryService} from '../domain/common'

@Injectable()
export class WorkFactoryService implements IWorkFactoryService {

  _createFromInput(input : NumberInput) {    
    var result = new TreeWorkNode();
    result.inputs = [input]
    result.name = input.label
    result.isSingleNode = true
    result.canAddLevel = false
    return result
  }
  
  _createSingleInput(name: string, value: number) {
    return new NumberInput(name, value)
  }

  _createSingleInputFrom(nInput : NumberInput) {
    var result = new TreeWorkNode();
    result.inputs = [nInput]
    result.name = nInput.label
    result.isSingleNode = true
    result.canAddLevel = false
    return result
  }  

  _createSimpleWork(wType : WorkType, calculate: Function, optInputs : NumberInput[] = [], addToolChangePhase: boolean  = false) {

    var totPrice = new TextInput(WorkConstant.work.tot_price_id, "0")
    var totMinutes = new TextInput(WorkConstant.work.tot_minutes_id, "0")
    var result = new TreeWorkNode(calculate)
    result.originalWorkName = WorkType[wType]
    result.name = WorkType[wType]
    result.outputs = [totPrice, totMinutes]
    result.editable = true
    result.isWork = true
    
    
    result.totTime = new NumberInput(WorkConstant.work.tot_minutes_id, 0)
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    const inputs = [
      this._createSingleInput(WorkConstant.work.hourly_price_id, 0),  //il prezzo totale va "gr"
      this._createSingleInput(WorkConstant.work.placement_time_id, 0),
    ]

    result.hourlyCost = inputs[0]

    for(let child of optInputs) {
      inputs.push(child)
    }

    const stages = []
    const singleInputs = inputs.map(i => this._createSingleInputFrom(i))
    //aggiungo anche gli input singoli alla lista dei "children", a fianco alle ExternalWorkFactoryService(verificare se non si possa fare diversamente...)
    for(let sIn of singleInputs) {
      stages.push(sIn)
    }

    //la fase di cambio utensile va dopo
    if(addToolChangePhase) {
      stages.push(this._createToolChangeStage(result.hourlyCost))
    }

    //Nodo vuoto per visualizzare subito l'input per la nuova fase
    const emptyStage = new TreeWorkNode()
    emptyStage.isStage = true
    stages.push(emptyStage)

    result.canAddLevel = true
    result.children = stages
    result.inputs = inputs
    return result;
  }

  _createComplexWork(wType : WorkType, calculate: Function, addToolChangePhase: boolean  = false)  {
    const childrens = [
      this._createSingleInput(WorkConstant.work.program_time_id, 0),
      this._createSingleInput(WorkConstant.work.tooling_time_id, 0)
    ]

    const result = this._createSimpleWork(wType, calculate, childrens, addToolChangePhase)

    return result;
  }

  //i figli sono sempre degli stage
  createDefaultChildrenNode() : TreeWorkNode {
    //senza name, in modo che parta la gestione del nuovo stage
    const emptyStage = new TreeWorkNode()
    emptyStage.isStage = true
    return emptyStage
  }

  _internalCreateStageForWork(
    wType : WorkType, 
    stageName: string,
    calc : Function,
    optOutputs: DisabledInput[] = [],
    optInputs: NumberInput[] = [],
    addDefault = true) {      
    
    var sMin = new TextInput(WorkConstant.stage.time_id, "0")
    var sPrice = new TextInput(WorkConstant.stage.price_id, "0")
    
    const outputs = optOutputs.slice()
    outputs.push(sMin)
    outputs.push(sPrice)

    const inputs = optInputs.slice()
    //questo flag serve perchè il taglio ha parametri totalmente diversi dagli altri
    if (addDefault)
    {
      inputs.push(new NumberInput(WorkConstant.stage.piece_count_id, 1))
      inputs.push(new NumberInput(WorkConstant.stage.step_count_id))
      inputs.push(new NumberInput(WorkConstant.stage.vel_id))
      inputs.push(new NumberInput(WorkConstant.stage.dist_id))
    }
    var result = new TreeWorkNode(calc)
    result.children = inputs.map(i => this._createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.name = stageName
    result.isStage = true
    return result
  }

  _createToolChangeStage(hourlyCost: NumberInput) {
    
    const outputs = [
      new TextInput(WorkConstant.stage.price_id, "0"),
      new TextInput(WorkConstant.stage.time_id, "0") 
      ]
    var result = new TreeWorkNode(calculateToolChange)
    result.hourlyCost = hourlyCost
    
    var inputs = []
    inputs.push(new NumberInput(WorkConstant.stage.tc_step_id))
    inputs.push(new NumberInput(WorkConstant.stage.tc_vel_id))
    inputs.push(new NumberInput(WorkConstant.stage.tc_dist_id))

    result.name = WorkConstant.stage.tc_name_id
    result.children = inputs.map(i => this._createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.isStage = true
    return  result

    

    //outputs ha optional, minuti, prezzo
    function calculateToolChange(treeWorkNode : TreeWorkNode){
      const corsa = treeWorkNode.inputs[2].value
      const velocita = treeWorkNode.inputs[1].value
      const ncambi = treeWorkNode.inputs[0].value
      //non posso dividere per 0..
      if (velocita > 0) {
        var minuti = (corsa * ncambi)/velocita
        treeWorkNode.outputs[1].text = minuti.toFixed(2)
        if (treeWorkNode.hourlyCost)
        {
          treeWorkNode.outputs[0].text = (minuti/60 * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }      
    }
  }
  
  fixChildrens(node : TreeWorkNode) {
    var priceChildrenInput = node.children.find(c => c.name === WorkConstant.work.hourly_price_id)
    var emptyStages = node.children.filter(c => c.isStage && c.name === "")
    if (node.workTimeEnabled()) {
      //gli unici children sono input, rimuovo visualizzo quindi un unico input per il tempo e per il prezzo
      node.children = [priceChildrenInput, this._createFromInput(node.totTime)]
      for(let stage of emptyStages) {
        node.children.push(stage)
      }
    }
  }

  //devo rimuovere dai figli il prezzo totale e ripristinare gli input coi tempi
  //e ovviamente le fasi
  restoreChildrens(node : TreeWorkNode) {
    let stages = node.children.filter(c => c.isStage)

    node.children = node.inputs.map(i => this._createSingleInputFrom(i))
    for(let stage of stages) {
      node.children.push(stage)
    }
  }


  createWork(wTypeString : string){
    const wType = WorkType[wTypeString]
    switch(wType) {
      case WorkType.Tornitura:
      case WorkType.Stozzatura:
      case WorkType.Dentatura:
      case WorkType.Fresatura:
      case WorkType.RettificaTangenziale:
      case WorkType.RettificaVerticale:
      {
        //lavorazioni con cambio utensile e tempi di attr/piazzamento
        return this._createComplexWork(wType, calculateWork, true)
        break         
      }
      
      case WorkType.ControlloQualita:
      case WorkType.IncisioneLaser:
      {
        //lavorazioni SENZA cambio utensile e tempi di attr/piazzamento
        return this._createComplexWork(wType, calculateWork)
        break         
      }
      case WorkType.Sabbiatura:
      case WorkType.Saldatura:
      case WorkType.Sbavatura:
      case WorkType.Taglio:
      {
        //lavorazioni con solo tempo di piazzamento
        return this._createSimpleWork(wType, calculateWork)
        break;    
      }
      default:
      {
        console.log('Error, work not supported: ' + wType.toString())
        return null
        break
      }
    }
    

    function calculateWork(treeWorkNode : TreeWorkNode) {
      
      //cambiando il costo della lavorazione bisogna aggiornare il costo delle singole fasi
      treeWorkNode.children
        .filter(c => c.isStage)
        .forEach(s => s.recalculate())

      var prezzoOrario = treeWorkNode.hourlyCost.value
      var totPriceOutput = treeWorkNode.outputs[0]
      var totMinutesOutput = treeWorkNode.outputs[1]

      //se non ci sono stage validi si comporta come una lavorazione esterna
      if (treeWorkNode.workTimeEnabled()) {
        var minuti = treeWorkNode.totTime.value

        totPriceOutput.text = ((minuti/60)*prezzoOrario).toFixed(2)
      } else {
        //somma dei dati delle fasi
        var totStagesPrice = treeWorkNode.children
          .filter(c => c.isStage && c.name !== "")
          .reduce((pn, u) => [ ...pn, ...u.outputs ], []) //tutti gli outputs di tutte le fasi
          .filter(o => o.label === WorkConstant.stage.price_id) //tutti i prezzi di fase
          .map(o => +(o.text)) //converto a number e sommo
          .reduce((sum, c) => sum + c, 0)

        var totToolingPrice = treeWorkNode.children
          .filter(c => c.isSingleNode 
            && (c.name === WorkConstant.work.placement_time_id
            || c.name === WorkConstant.work.program_time_id
            || c.name === WorkConstant.work.tooling_time_id))
          .map(c => c.inputs[0].value)
          .reduce((sum, c) => sum + c*(prezzoOrario/ 60), 0)

        const totPrice = (totStagesPrice + totToolingPrice)

        treeWorkNode.totTime.value = totPrice/prezzoOrario * 60
        totPriceOutput.text = totPrice.toFixed(2)
      }
      
      totMinutesOutput.text = treeWorkNode.totTime.value.toFixed(2)
    }
  }

  createStageForWork(wTypeString : string, stageName: string) {
    const wType = WorkType[wTypeString]
    switch(wType) {
      case WorkType.Dentatura:
      case WorkType.Fresatura:
      case WorkType.IncisioneLaser:
      case WorkType.RettificaTangenziale:
      case WorkType.RettificaVerticale:
      case WorkType.Sabbiatura:
      case WorkType.Saldatura:
      case WorkType.Sbavatura:
      case WorkType.Stozzatura:
      {
        return this._internalCreateStageForWork(wType, stageName, calculateStandardStage)
        break;
      }
      case WorkType.ControlloQualita:
      {
        const optValues = [
          new NumberInput(WorkConstant.stage.cc_distz_id),
          new NumberInput(WorkConstant.stage.cc_stepz_id),
          new NumberInput(WorkConstant.stage.cc_velz_id)
        ]
        return this._internalCreateStageForWork(wType, stageName,calculateCQualita, [], optValues)
        break;
      }
      case WorkType.Taglio:
      {
        const optValues = [
          new NumberInput(WorkConstant.stage.step_count_id, 1),
          new NumberInput(WorkConstant.stage.t_area_id),
          new NumberInput(WorkConstant.stage.t_resa_id)]

        const optOutput = [
          new TextInput(WorkConstant.stage.t_vel_id, '0')
        ]
        return this._internalCreateStageForWork(wType, stageName, calculateStageTaglio, optOutput, optValues, false)
        break;
      }
      case WorkType.Tornitura:
      {
        const optValues = [
          new NumberInput(WorkConstant.stage.tor_giri_min_id),
          new NumberInput(WorkConstant.stage.tor_mm_giro_id)]

        const optOutput = [
          new TextInput(WorkConstant.stage.tor_vel_min_id, '0')
        ]
          
        var tornitura = this._internalCreateStageForWork(wType, stageName,  calculateTornituraStage, optOutput, optValues)

        var velIn = tornitura.inputs.find(i => i.label === WorkConstant.stage.vel_id)
        var velC = tornitura.children.find(c => c.name === WorkConstant.stage.vel_id)
        var i = tornitura.inputs.indexOf(velIn)
        var c = tornitura.children.indexOf(velC)
        if (i !== -1 && c !== -1) {
          tornitura.inputs.splice(i, 1)
          tornitura.children.splice(c, 1)
        } else {
          console.log("error, cannot form " + tornitura.name + " stage properly")
        }

        return tornitura
        break;
      }
      default:
        console.log('Cannot create stage for: ' + wType)
        return null
    }

    //outputs ha optional, minuti, prezzo
    function calculateStageTaglio(treeWorkNode : TreeWorkNode){
      const resa = treeWorkNode.inputs[2].value
      const area = treeWorkNode.inputs[1].value
      const pezzi = treeWorkNode.inputs[0].value
      //non posso dividere per 0..
      if (pezzi > 0 && resa > 0) {
        var minuti = area / resa
        var secondi = minuti * 60
        treeWorkNode.outputs[1].text = minuti.toFixed(2)
        treeWorkNode.outputs[0].text = secondi.toFixed(2)
        if (treeWorkNode.hourlyCost){
          treeWorkNode.outputs[2].text = (minuti/60 * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }      
    }

    //outputs ha optional, minuti, prezzo
    function calculateCQualita(treeWorkNode : TreeWorkNode){
      const distanzaZ = treeWorkNode.inputs[0].value
      const passateZ = treeWorkNode.inputs[1].value
      const velocitaZ = treeWorkNode.inputs[2].value
      const pezzi = treeWorkNode.inputs[3].value
      const passate = treeWorkNode.inputs[4].value
      const velocita = treeWorkNode.inputs[5].value
      const distanza = treeWorkNode.inputs[6].value
      //non posso dividere per 0..
      if (pezzi > 0 && velocitaZ > 0 && velocita) {
        var j13 = 
          ((distanzaZ * passateZ) / velocitaZ) + 
          ((distanza * passate) / velocita)
        var k45 = j13 * pezzi
        treeWorkNode.outputs[0].text = k45.toFixed(2)

        if (treeWorkNode.hourlyCost){
          treeWorkNode.outputs[1].text = (k45/60 * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }      
    }

    function calculateStandardStage(treeWorkNode : TreeWorkNode) {
      const pezzi = treeWorkNode.inputs[0].value
      const passate = treeWorkNode.inputs[1].value
      const velocita = treeWorkNode.inputs[2].value
      const distanza = treeWorkNode.inputs[3].value
      //non posso dividere per 0..
      if (pezzi > 0 && velocita) {
        var minuti = ((distanza * passate) / velocita)
        treeWorkNode.outputs[0].text = minuti.toFixed(2)
        if (treeWorkNode.hourlyCost){
          treeWorkNode.outputs[1].text = (minuti/60 * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }
    }

    function calculateTornituraStage(treeWorkNode : TreeWorkNode) {
      
      const giriM = treeWorkNode.inputs[0].value
      const velMG = treeWorkNode.inputs[1].value
      const pezzi = treeWorkNode.inputs[2].value
      const passate = treeWorkNode.inputs[3].value
      const distanza = treeWorkNode.inputs[4].value

      var velocita = (velMG * giriM)
      treeWorkNode.outputs[0].text = velocita.toFixed(2)
      //non posso dividere per 0..
      if (pezzi > 0 && velocita > 0) {
        var minuti = (distanza * passate / velocita)
        treeWorkNode.outputs[1].text = minuti.toFixed(2)
        if (treeWorkNode.hourlyCost) {
          treeWorkNode.outputs[2].text = (minuti /60 * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }
    }
  }

  createFromWork(work: any) : TreeWorkNode {

    const w = work as Work
    if (w === null) return null
    
    //creo la struttura ad albero a seconda della lavorazione
    var result = this.createWork(w.originalWorkName)
    if (w.fasi) {
      for(const s of w.fasi){
        const nodoFase = this.createStageForWork(w.originalWorkName, s.name)
        //Questo per evitare di creare 2 stage di cambio utensile (se ci sono)
        if (!result.children.some(c => c.name === s.name)) {
          result.children.push(nodoFase)
        }
      }
    } else {
      //lavorazione salvata senza fasi
      //console.log("Error")
    }

    
    //mappo i dati di lavorazione e stages
    Work.mapTo(w, result)
    return result
  }
}

