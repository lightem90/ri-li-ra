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
    var result = new TreeWorkNode();
    var sIn = new NumberInput(name, value)
    result.inputs = [sIn]
    result.name = name
    result.isSingleNode = true
    return result
  }

  _createSingleInputFrom(nInput : NumberInput) {
    var result = new TreeWorkNode();
    result.inputs = [nInput]
    result.name = nInput.label
    result.isSingleNode = true
    return result
  }  

  _createSimpleWork(wType : WorkType, optChildrens : TreeWorkNode[] = [], addToolChangePhase: boolean  = false) {
 
    var pricePerPiece = new TextInput('pricePerPiece', "0")
    var result = new TreeWorkNode()
    result.name = WorkType[wType]
    result.outputs = [pricePerPiece]
    result.editable = true
    result.isWork = true
    
    var totMinIn = new TextInput('wMinutes', "0")
    result.totTimeReadOnly = totMinIn
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    const childrens = [
      this._createSingleInput('wPriceH', 0),  //il prezzo totale va "gr"
      this._createSingleInput('wTPiaz', 0),
    ]

    for(let child of optChildrens) {
      childrens.push(child)
    }

    if(addToolChangePhase) {
      childrens.push(this._createToolChangeStage())
    }
    //Nodo vuoto per visualizzare subito l'input per la nuova fase
    childrens.push(new TreeWorkNode())
    result.children = childrens
    return result;
  }

  _createComplexWork(wType : WorkType, addToolChangePhase: boolean  = false) 
  {
    const childrens = [
      this._createSingleInput('wTProg', 0),
      this._createSingleInput('wTAtt', 0)
    ]

    const result = this._createSimpleWork(wType, childrens, addToolChangePhase)

    return result;
  }

  _internalCreateStageForWork(
    wType : WorkType, 
    stageName: string,
    optOutputs: DisabledInput[] = [],
    optInputs: NumberInput[] = [],
    addDefault = true,
    calc : Function = null) {      
    
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
    if (node.workTimeEnabled) {
      //gli unici children sono input, rimuovo visualizzo quindi un unico input per il tempo e per il prezzo
      var priceChildrenInput = node.children.find(c => c.name === 'wPriceH')
      node.children = [priceChildrenInput, this._createFromInput(node.totTime)]
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
        return this._createComplexWork(wType, true)
        break         
      }
      
      case WorkType.ControlloQualita:
      case WorkType.IncisioneLaser:
      {
        //lavorazioni SENZA cambio utensile e tempi di attr/piazzamento
        return this._createComplexWork(wType)
        break         
      }
      case WorkType.Sabbiatura:
      case WorkType.Saldatura:
      case WorkType.Sbavatura:
      case WorkType.Taglio:
      {
        //lavorazioni con solo tempo di piazzamento
        return this._createSimpleWork(wType)
        break;    
      }
      default:
      {
        console.log('Error, work not supported: ' + wType.toString())
        return null
        break
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
        return this._internalCreateStageForWork(wType, stageName)
        break;
      }
      case WorkType.ControlloQualita:
      {
        const optValues = [
          new NumberInput('mm_z'),
          new NumberInput('p_z'),
          new NumberInput('v_z')
        ]
        return this._internalCreateStageForWork(wType, stageName, [], optValues)
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
        return this._internalCreateStageForWork(wType, stageName, optOutput, optValues, false, calculateStageTaglio)
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
          
        return this._internalCreateStageForWork(wType, stageName, optOutput, optValues)
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
        treeWorkNode.outputs[1].text = minuti.toString()
        treeWorkNode.outputs[0].text = secondi.toString()
        treeWorkNode.outputs[2].text = (minuti * treeWorkNode.hourlyCost.value).toString()
      }
      
    }
    

  }

}