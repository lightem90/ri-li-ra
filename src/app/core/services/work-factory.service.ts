import { Injectable } from '@angular/core';

import {
  WorkStage, 
  WorkType, 
  ToolChangeStage, 
  Work, 
  FixedWorkTimes, 
  OptionalStageValue,
  TreeWorkNode
} from '../domain/works'

import {NumberInput, TextInput, DisabledInput} from '../domain/common'

@Injectable()
export class WorkFactoryService {

  constructor() { 

  }
  

  createSingleInput(name: string, value: number) {
    var result = new TreeWorkNode();
    var sIn = new NumberInput(name, value)
    result.inputs = [sIn]
    result.name = name
    return result
  }

  createSingleInputFrom(nInput : NumberInput) {
    var result = new TreeWorkNode();
    result.inputs = [nInput]
    result.name = nInput.label
    return result
  }  

  createWorkWithoutInputs(wType : WorkType)
  {    
    var totMinIn = new TextInput('wMinutes', "0")
    var pricePerPiece = new TextInput('pricePerPiece', "0")
    var result = new TreeWorkNode()
    result.name = wType.toString()
    result.outputs = [totMinIn, pricePerPiece]
    result.editable = true
    return result
  }

  createSimpleWork(wType : WorkType) {
 
    const result = this.createWorkWithoutInputs(wType)
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    result.children = [
      this.createSingleInput('wTPiaz', 0),
      this.createSingleInput('wPriceH', 0),
      this.createSingleInput('wMinutes', 0),
      new TreeWorkNode()
      ]
    return result;
  }

  createComplexWork(wType : WorkType) {

    const result = this.createWorkWithoutInputs(wType)
    //di default c'è lo stage placeholder in modo da poter aggiungerne uno subito, ammenochè serva aggiungere anche il cambio utensile, in quel caso saranno due TreeWorkNodes
    result.children = [
      this.createSingleInput('wTPiaz', 0),
      this.createSingleInput('wTProg', 0),
      this.createSingleInput('wTAtt', 0),
      this.createSingleInput('wPriceH', 0),
      this.createSingleInput('wMinutes', 0),
      new TreeWorkNode()
      ]
    return result;
  }

  internalCreateStageForWork(
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
    result.children = inputs.map(i => this.createSingleInputFrom(i))
    result.outputs = outputs
    result.inputs = inputs
    result.name = stageName
    return result
  }

  createToolChangeStage() {
    return new TreeWorkNode() //todo in/out
  }


  createWork(wType : WorkType){

    const selectedWork = WorkType[wType];
    switch(selectedWork) {
      case WorkType.Tornitura:
      case WorkType.Stozzatura:
      case WorkType.ControlloQualita:
      case WorkType.Dentatura:
      case WorkType.Fresatura:
      case WorkType.IncisioneLaser:
      case WorkType.RettificaTangenziale:
      case WorkType.RettificaVerticale:
      {
        return this.createComplexWork(wType)
        break         
      }
      case WorkType.Sabbiatura:
      case WorkType.Saldatura:
      case WorkType.Sbavatura:
      case WorkType.Taglio:
      {
        return this.createSimpleWork(wType)
        break;    
      }
      default:
      {
        console.log('error, work not supported: ' + wType.toString())
        return null
        break
      }
    }
  }

  createStageForWork(wType : WorkType, stageName: string) {

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
        return this.internalCreateStageForWork(wType, stageName)
      }
      case WorkType.ControlloQualita:
      {
        const optValues = [
          new NumberInput('mm_z'),
          new NumberInput('p_z'),
          new NumberInput('v_z')
        ]
        return this.internalCreateStageForWork(wType, stageName, [], optValues)
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
        return this.internalCreateStageForWork(wType, stageName, optOutput, optValues, false)
      }
      case WorkType.Tornitura:
      {
        const optValues = [
          new NumberInput('tor_giri_min'),
          new NumberInput('tor_mm_giro')]

        const optOutput = [
          new TextInput('tornMMin', '0')
        ]
          
        return this.internalCreateStageForWork(wType, stageName, optOutput, optValues)
      }
      default:
        console.log('Cannot create stage for: ' + wType)
        return null
    }

  }

}