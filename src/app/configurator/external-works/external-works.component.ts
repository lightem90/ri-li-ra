import { Component, OnInit, Input } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { AccountManagerService } from '../../core/services/account-manager.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {ThermalWorkType, SuperficialWorkType, ExternalWorkType, WorkType, ExternalWork} from '../../core/domain/work'
import {IWorkTreeService} from '../../core/domain/common'
import {WorkTreeService} from '../../core/services/work-tree.service'
import {ExternalWorkFactoryService} from '../../core/services/externalwork-factory.service'

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
  
  workThermTypes: string[]
  workSupTypes: string[]
  workExtTypes: string[]

  userExtWorks : ExternalWork[] = []
  _userExtWorksLoaded : boolean = false

  tot_lav_ext : DisabledInput

  constructor(
    private _accountService : AccountManagerService,
    private _workFactory : ExternalWorkFactoryService,
    private _configuratorService : ConfiguratorService) { 

      this.workThermTypes = Object.values(ThermalWorkType).filter(x => typeof x === 'string')
      this.workSupTypes = Object.values(SuperficialWorkType).filter(x => typeof x === 'string')
      this.workExtTypes = Object.values(ExternalWorkType).filter(x => typeof x === 'string')

      this._accountService
        .fetchExternalUserWorks()
        .then(r => {
          this.userExtWorks = r
          this._userExtWorksLoaded = true
        })
    }


    ngOnInit() {
      this.tot_lav_ext = this._configuratorService.currentSession.tot_lav_ext
    }

    updateTreeOne(sumOfWorks : number) {
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