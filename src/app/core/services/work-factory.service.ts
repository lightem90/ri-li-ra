import { Injectable } from '@angular/core';

import {
  WorkStage, 
  WorkType, 
  ToolChangeStage, 
  Work, 
  FixedWorkTimes, 
  OptionalStageValue
} from '../domain/works'

@Injectable()
export class WorkFactoryService {

  constructor() { 

  }



  createSimpleWork(wType : WorkType) {
    var fixedTimes: FixedWorkTimes[] = [
      new FixedWorkTimes('TPiaz')
    ]
    return new Work(
      wType, 
      "", 
      fixedTimes
    )
  }

  createComplexWork(wType : WorkType) {
    
    var fixedTimes: FixedWorkTimes[] = [
      new FixedWorkTimes('TPiaz'),
      new FixedWorkTimes('TProg'),
      new FixedWorkTimes('TAttr')
    ]
    return new Work(
      wType, 
      "", 
      fixedTimes
    )
  }

  createSimpleStageForWork(wType : WorkType) {
    return new WorkStage(wType);
  }


  createWork(wType : WorkType){

    const selectedWork = WorkType[wType];
    switch(selectedWork) {
      case WorkType.ControlloQualita:
      {
        return this.createComplexWork(wType)        
      }
      case WorkType.Dentatura:
      {
        return this.createComplexWork(wType)      
      }
      case WorkType.Fresatura:
      {
        return this.createComplexWork(wType)  
      }
      case WorkType.IncisioneLaser:
      {
        return this.createComplexWork(wType)         
      }
      case WorkType.RettificaTangenziale:
      {
        return this.createComplexWork(wType)     
      }
      case WorkType.RettificaVerticale:
      {
        return this.createComplexWork(wType)       
      }
      case WorkType.Sabbiatura:
      {
        return this.createSimpleWork(wType)    
      }
      break;
      case WorkType.Saldatura:
      {
        return this.createSimpleWork(wType)        
      }
      case WorkType.Sbavatura:
      {
        return this.createSimpleWork(wType)      
      }
      case WorkType.Stozzatura:
      {
        return this.createComplexWork(wType)       
      }
      case WorkType.Taglio:
      {
        return this.createSimpleWork(wType)      
      }
      case WorkType.Tornitura:
      {
        return this.createComplexWork(wType)         
      }
      default:
      {
        return null
        break
      }
    }
  }

  createStageForWork(wType : WorkType) {

    switch(WorkType[wType]) {
      case WorkType.ControlloQualita:
      {
        const optValues = [
          new OptionalStageValue('mm_z'),
          new OptionalStageValue('p_z'),
          new OptionalStageValue('v_z')
        ]
        return new WorkStage(wType, optValues);
      }
      break;
      case WorkType.Dentatura:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Fresatura:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.IncisioneLaser:
      {
        //forse da rivedere (mm/min o mm/sec)
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.RettificaTangenziale:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.RettificaVerticale:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Sabbiatura:
      {
        //gestisco da interfaccia la differenza tra mm quadri e mm quadri al minuto, la formula non cambia
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Saldatura:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Sbavatura:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Stozzatura:
      {
        return this.createSimpleStageForWork(wType)
      }
      case WorkType.Taglio:
      {
        const optValues = [
          new OptionalStageValue('t_area'),
          new OptionalStageValue('t_resa')]

        return new WorkStage(wType, optValues);
      }
      case WorkType.Tornitura:
      {
        const optValues = [
          new OptionalStageValue('tor_giri_min'),
          new OptionalStageValue('tor_mm_giro')]
          
        return new WorkStage(wType, optValues);
      }
    }

  }

}