import { Component, OnInit, Input } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType} from '../../core/domain/works'
import {ThermalWorkType, SuperficialWorkType, ExternalWorkType} from '../../core/domain/external-works'
import {IWorkTreeService} from '../../core/domain/common'
import {WorkTreeService} from '../../core/services/work-tree.service'
import {ExternalWorkFactoryService} from '../../core/services/work-factory.service'

import { ConfiguratorService } from '../../core/services/configurator.service'

import {NumberInput, DisabledInput} from '../../core/domain/common'

@Component({
  selector: 'app-external-works',
  templateUrl: './external-works.component.html',
  styleUrls: ['./external-works.component.css']
})
export class ExternalWorksComponent implements OnInit {
    
  public treeServiceThermal: WorkTreeService
  public treeServiceSuperficial: WorkTreeService
  public treeServiceExternal: WorkTreeService

  sumThreeOne = 0
  sumThreeTwo = 0
  sumThreeThree = 0
  
  //stati per il combo
  workThermTypes: ThermalWorkType[]
  selectedWorkThermalType : ThermalWorkType = null

  //stati per il combo
  workSupTypes: SuperficialWorkType[]
  selectedWorkSupType : SuperficialWorkType = null

  //stati per il combo
  workExtTypes: ExternalWorkType[]
  selectedExtWorkType : ExternalWorkType = null

  tot_lav_ext : DisabledInput

  constructor(
    private _factory : ExternalWorkFactoryService,
    private _configuratorService : ConfiguratorService) { 
      this.treeServiceThermal = new WorkTreeService(_factory) 
      this.treeServiceSuperficial = new WorkTreeService(_factory) 
      this.treeServiceExternal = new WorkTreeService(_factory)

      this.workThermTypes = Object.values(ThermalWorkType).filter(x => typeof x === 'string')
      this.selectedWorkThermalType = this.workThermTypes[0]
      this.workSupTypes = Object.values(SuperficialWorkType).filter(x => typeof x === 'string')
      this.selectedWorkSupType = this.workSupTypes[0]
      this.workExtTypes = Object.values(ExternalWorkType).filter(x => typeof x === 'string')
      this.selectedExtWorkType = this.workExtTypes[0]
    }


    ngOnInit() {
      this.tot_lav_ext = this._configuratorService.currentSession.tot_lav_ext
    }

    addThermWork() {
      this.treeServiceThermal.addWork(this.selectedWorkThermalType.toString())
    }

    addSupWork() {
      this.treeServiceSuperficial.addWork(this.selectedWorkSupType.toString())
    }

    addExtWork() {
      this.treeServiceExternal.addWork(this.selectedExtWorkType.toString())
    }

    updateTreeOne(sumOfWorks : number) {
      console.log("ext comp sum: " + sumOfWorks)
      this.sumThreeOne = sumOfWorks
      this.recalcAll()
    }
    updateTreeTwo(sumOfWorks : number) {
      this.sumThreeTwo = sumOfWorks
      this.recalcAll()
    }
    updateTreeThree(sumOfWorks : number) {
      this.sumThreeThree = sumOfWorks
      this.recalcAll()
    }

    recalcAll() {
      this.tot_lav_ext.text = (this.sumThreeOne + this.sumThreeTwo + this.sumThreeThree).toFixed(2)
      this._configuratorService.calculateBudget()
    }

}