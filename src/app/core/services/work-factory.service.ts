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
}

@Injectable()
export class ExternalWorkFactoryService implements IWorkFactoryService {

  _createExternalWorkNode(wTypeString : string) : TreeWorkNode {
    const result = new TreeWorkNode()
    result.textInputs.push(new TextInput('udm', 'Kg'))
    result.inputs.push(new NumberInput('unitaryPrice', 0))
    result.outputs = [
      new TextInput('wMinutes', "0"),
      new TextInput('wMinutes', "0")
    ]
    result.name = wTypeString
    return result
  }
  //si possono specificare per ogni lavorazione estrna unità di misura e prezzo unitario
  createWork(wTypeString : string) {
    return this._createExternalWorkNode(wTypeString)
  }
  
  createStageForWork(wTypeString : string, stageName: string) : TreeWorkNode{
    return this._createExternalWorkNode(stageName)
  }
}


@Injectable()
export class WorkFactoryService implements IWorkFactoryService {

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

  _createWorkWithoutInputs(wType : WorkType)
  {    
    var totMinIn = new TextInput('wMinutes', "0")
    var pricePerPiece = new TextInput('pricePerPiece', "0")
    var result = new TreeWorkNode()
    result.name = wType.toString()
    result.outputs = [totMinIn, pricePerPiece]
    result.editable = true
    return result
  }

  _createSimpleWork(wType : WorkType, addToolChangePhase: boolean  = false) {
 
    const result = this._createWorkWithoutInputs(wType)
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    const inputs = [
      this._createSingleInput('wTPiaz', 0),
      this._createSingleInput('wPriceH', 0),
      this._createSingleInput('wMinutes', 0),
      ]

    if(addToolChangePhase) {
      inputs.push(this._createToolChangeStage())
    }
    //Nodo vuoto per visualizzare subito l'input per la nuova fase
    inputs.push(new TreeWorkNode())
    result.children = inputs
    return result;
  }

  _createComplexWork(wType : WorkType, addToolChangePhase: boolean  = false) 
  {
    console.log(wType)
    const result = this._createWorkWithoutInputs(wType)
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes

    const inputs = [
      this._createSingleInput('wTPiaz', 0),
      this._createSingleInput('wTProg', 0),
      this._createSingleInput('wTAtt', 0),
      this._createSingleInput('wPriceH', 0),
      this._createSingleInput('wMinutes', 0) 
      ]
    
    if(addToolChangePhase) {
      inputs.push(this._createToolChangeStage())
    }
    
    //Nodo vuoto per visualizzare subito l'input per la nuova fase
    inputs.push(new TreeWorkNode())

    result.children = inputs
    return result;
  }

  _internalCreateStageForWork(
    wType : WorkType, 
    stageName: string,
    optOutputs: DisabledInput[] = [],
    optInputs: NumberInput[] = [],
    addDefault = true) {      //questo flag serve perchè il taglio ha parametri totalmente diversi dagli altri
    
    var sMin = new TextInput('sMinutes', "0")
    var sPrice = new TextInput('sPrice', "0")
    
    const outputs = optOutputs.slice()
    outputs.push(sMin)
    outputs.push(sPrice)

    const inputs = optInputs.slice()
    if (addDefault)
    {
      inputs.push(new NumberInput('nPiece'))
      inputs.push(new NumberInput('nStep'))
      inputs.push(new NumberInput('mVel'))
      inputs.push(new NumberInput('mMm'))
    }

    var result = new TreeWorkNode()
    result.children = inputs.map(i => this._createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.name = stageName
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

    return  result
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
    switch(+wTypeString) {
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
      }
      case WorkType.ControlloQualita:
      {
        const optValues = [
          new NumberInput('mm_z'),
          new NumberInput('p_z'),
          new NumberInput('v_z')
        ]
        return this._internalCreateStageForWork(wType, stageName, [], optValues)
      }
      case WorkType.Taglio:
      {
        const optValues = [
          new NumberInput('nPiece'),
          new NumberInput('t_area'),
          new NumberInput('t_resa')]

        const optOutput = [
          new TextInput('taglioSec', '0')
        ]
        return this._internalCreateStageForWork(wType, stageName, optOutput, optValues, false)
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
      }
      default:
        console.log('Cannot create stage for: ' + wType)
        return null
    }

  }

}