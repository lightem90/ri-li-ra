import { Injectable } from '@angular/core';

import {
  WorkStage, 
  WorkType, 
  ToolChangeStage, 
  Work, 
  FixedWorkTimes, 
  OptionalStageValue
} from '../domain/works'

import {
  TreeWorkNode,
  TreeWorkFlatNode
} from "../domain/common"

import {NumberInput, TextInput, DisabledInput} from '../domain/common'

export interface IWorkFactoryService 
{
  createWork(wTypeString : string) : TreeWorkNode
  createStageForWork(wTypeString : string, stageName: string) : TreeWorkNode
  fixChildrens(node : TreeWorkNode)
  restoreChildrens(node : TreeWorkNode)
  createDefaultChildrenNode() : TreeWorkNode
}

@Injectable()
export class ExternalWorkFactoryService implements IWorkFactoryService {

  _createSingleInput(name: string, value: number) {
    var result = new TreeWorkNode();
    var sIn = new NumberInput(name, value)
    result.inputs = [sIn]
    result.name = name
    result.isSingleNode = true
    return result
  }

  _createSingleTextInput(name: string, value: string) {
    var result = new TreeWorkNode();
    var sIn = new TextInput(name, value)
    result.textInputs = [sIn]
    result.name = name
    result.isSingleNode = true
    return result
  }

  _createExternalWorkNode(wTypeString : string) : TreeWorkNode {
    const result = new TreeWorkNode()
    //servono per gli if di interfaccia
    result.textInputs.push(new TextInput('udm', 'Kg'))
    result.inputs.push(new NumberInput('unitaryPrice', 0))
    result.inputs.push(new NumberInput('PercRic', 0))
    result.outputs = [
      new TextInput('totPrice', "0")
    ]
    result.children = [
      this._createSingleInput('unitaryPrice', 0),
      this._createSingleInput('PercRic', 0),
      this._createSingleTextInput('udm', 'Kg')
    ]
    result.name = wTypeString
    result.canAddLevel = false
    return result
  }
  //si possono specificare per ogni lavorazione estrna unità di misura e prezzo unitario
  //gli enum sono solo "da fuori" a me interessa solo il tipo
  createWork(wTypeString : string) {
    return this._createExternalWorkNode(wTypeString)
  }
  
  createStageForWork(wTypeString : string, stageName: string) : TreeWorkNode{
    return this._createExternalWorkNode(stageName)
  }

  createHeaderNode(title : string) {
    var result = new TreeWorkNode()
    result.name = title
    result.children = [new TreeWorkNode()]
    return result
  }

  fixChildrens(node : TreeWorkNode) {

  }

  restoreChildrens(node : TreeWorkNode) {

  }

  //mai chiamato, non ci sono stage, in questa modalitò ci sono solo elementi di primo livello
  createDefaultChildrenNode() {
    return new TreeWorkNode()
  }
}


@Injectable()
export class WorkFactoryService implements IWorkFactoryService {

  _createFromInput(input : NumberInput) {    
    var result = new TreeWorkNode();
    result.inputs = [input]
    result.name = input.label
    result.isSingleNode = true
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
    return result
  }  

  _createSimpleWork(wType : WorkType, calculate: Function, optInputs : NumberInput[] = [], addToolChangePhase: boolean  = false) {
 
    var totPrice = new TextInput('totPrice', "0")
    var result = new TreeWorkNode(calculate)
    result.name = WorkType[wType]
    result.outputs = [totPrice]
    result.editable = true
    result.isWork = true
    
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    const inputs = [
      this._createSingleInput('wPriceH', 0),  //il prezzo totale va "gr"
      this._createSingleInput('wTPiaz', 0),
    ]

    result.hourlyCost = inputs[0]

    for(let child of optInputs) {
      inputs.push(child)
    }

    const stages = []

    if(addToolChangePhase) {
      stages.push(this._createToolChangeStage())
    }
    //Nodo vuoto per visualizzare subito l'input per la nuova fase
    const emptyStage = new TreeWorkNode()
    emptyStage.isStage = true
    stages.push()
    const singleInputs = inputs.map(i => this._createSingleInputFrom(i))
    //aggiungo anche gli input singoli alla lista dei "children", a fianco alle ExternalWorkFactoryService(verificare se non si possa fare diversamente...)
    for(let sIn of singleInputs) {
      stages.push(sIn)
    }

    result.children = stages
    result.inputs = inputs
    return result;
  }

  _createComplexWork(wType : WorkType, calculate: Function, addToolChangePhase: boolean  = false)  {
    const childrens = [
      this._createSingleInput('wTProg', 0),
      this._createSingleInput('wTAtt', 0)
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
    
    var sMin = new TextInput('sMinutes', "0")
    var sPrice = new TextInput('sPrice', "0")
    
    const outputs = optOutputs.slice()
    outputs.push(sMin)
    outputs.push(sPrice)

    const inputs = optInputs.slice()
    //questo flag serve perchè il taglio ha parametri totalmente diversi dagli altri
    if (addDefault)
    {
      inputs.push(new NumberInput('nPiece', 1))
      inputs.push(new NumberInput('nStep'))
      inputs.push(new NumberInput('mVel'))
      inputs.push(new NumberInput('mMm'))
    }
    var result = new TreeWorkNode(calc)
    result.children = inputs.map(i => this._createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.name = stageName
    result.isStage = true
    return result
  }

  _createToolChangeStage() {
    
    const outputs = [
      new TextInput('sMinutes', "0"), 
      new TextInput('sPrice', "0")
      ]
    var result = new TreeWorkNode()

    var inputs = []
    inputs.push(new NumberInput('nStepCmUt'))
    inputs.push(new NumberInput('mVelCmUt'))
    inputs.push(new NumberInput('mMmCmUt'))

    result.name = 'cmUt'
    result.children = inputs.map(i => this._createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.isStage = true
    return  result
  }
  
  fixChildrens(node : TreeWorkNode) {
    var priceChildrenInput = node.children.find(c => c.name === 'wPriceH')
    var emptyStages = node.children.filter(c => c.isStage && c.name === "")
    if (node.workTimeEnabled) {
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
      
      //se non ci sono stage validi si comporta come una lavorazione esterna
      var totPriceOutput = treeWorkNode.outputs[0]
      if (treeWorkNode.workTimeEnabled()) {
        var minuti = treeWorkNode.totTime.value
        var prezzo = treeWorkNode.hourlyCost.value

        totPriceOutput.text = ((minuti/60)*prezzo).toFixed(2)
      } else {
        //somma dei dati delle fasi
        var totStagesPrice = treeWorkNode.children
          .filter(c => c.isStage && c.name !== "")
          .reduce((sum, c) => sum + (+c.outputs[1].text), 0);

        var totToolingTimes = treeWorkNode.children
          .filter(c => c.isSingleNode && c.name !== "wPriceH")
          .reduce((sum, c) => sum + 
            (treeWorkNode.hourlyCost.value)*(c.inputs[0].value/ 60), 0)

        totPriceOutput.text = (totStagesPrice + totToolingTimes).toFixed(2)
      }
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
          new NumberInput('mm_z'),
          new NumberInput('p_z'),
          new NumberInput('v_z')
        ]
        return this._internalCreateStageForWork(wType, stageName,calculateCQualita, [], optValues)
        break;
      }
      case WorkType.Taglio:
      {
        const optValues = [
          new NumberInput('nPiece', 1),
          new NumberInput('t_area'),
          new NumberInput('t_resa')]

        const optOutput = [
          new TextInput('taglioSec', '0')
        ]
        return this._internalCreateStageForWork(wType, stageName, calculateStageTaglio, optOutput, optValues, false)
        break;
      }
      case WorkType.Tornitura:
      {
        const optValues = [
          new NumberInput('tor_giri_min'),
          new NumberInput('tor_mm_giro')]

        const optOutput = [
          new TextInput('tornMMin', '0')
        ]
          
        var tornitura = this._internalCreateStageForWork(wType, stageName,  calculateTornituraStage, optOutput, optValues)

        var velIn = tornitura.inputs.find(i => i.label == "mVel")
        var velC = tornitura.children.find(c => c.name == "mVel")
        var i = tornitura.inputs.indexOf(velIn)
        var c = tornitura.children.indexOf(velC)
        if (i !== -1 && c !== -1) {
          tornitura.inputs.splice(i, 1)
          tornitura.children.splice(c, 1)
        } else {
          console.log("error, cannot form Tornitura stage properly")
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
        if (treeWorkNode.hourlyCost)
        {
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
          ((distanzaZ * passateZ) / velocitaZ)/60 + 
          ((distanza * passate) / velocita)/60
        var k45 = j13 * pezzi
        treeWorkNode.outputs[0].text = k45.toFixed(2)
        if (treeWorkNode.hourlyCost)
        {
          treeWorkNode.outputs[1].text = (k45 * treeWorkNode.hourlyCost.value).toFixed(2)
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
        var minuti = ((distanza * passate) / velocita)/60
        treeWorkNode.outputs[0].text = minuti.toFixed(2)
        if (treeWorkNode.hourlyCost)
        {
          treeWorkNode.outputs[1].text = (minuti * treeWorkNode.hourlyCost.value).toFixed(2)
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
        var minuti = (distanza * passate * velocita)
        treeWorkNode.outputs[1].text = minuti.toFixed(2)
        if (treeWorkNode.hourlyCost)
        {
          treeWorkNode.outputs[2].text = (minuti * treeWorkNode.hourlyCost.value).toFixed(2)
        }
      }

    }
  }
}

