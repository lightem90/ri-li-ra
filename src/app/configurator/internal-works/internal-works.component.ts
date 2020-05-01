import { Component, OnInit, Input } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType} from '../../core/domain/works'
import {IWorkTreeService} from '../../core/domain/common'
import {WorkTreeService} from '../../core/services/work-tree.service'
import {WorkFactoryService} from '../../core/services/work-factory.service'

import { ConfiguratorService } from '../../core/services/configurator.service'

import {NumberInput, DisabledInput} from '../../core/domain/common'

@Component({
  selector: 'app-internal-works',
  templateUrl: './internal-works.component.html',
  styleUrls: ['./internal-works.component.css']
})
export class InternalWorksComponent implements OnInit {

    //stati per il combo
    workTypes: WorkType[]
    selectedWorkType : WorkType = null
    charge : NumberInput
    tot_lav_int : DisabledInput
    tot_lav_int_charge : DisabledInput
    public treeService: WorkTreeService

    constructor(
      private _workFactory : WorkFactoryService,
      private _configuratorService : ConfiguratorService) {  

      this.treeService = new WorkTreeService(_workFactory)

      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      this.selectedWorkType = this.workTypes[0]
    }


    ngOnInit() {
      this.charge = this._configuratorService.currentSession.charge_lav_int;
      this.tot_lav_int = this._configuratorService.currentSession.tot_lav_int;
      this.tot_lav_int_charge = this._configuratorService.currentSession.tot_lav_int_charge;
    }

    addWork() {
      this.treeService.addWork(this.selectedWorkType.toString())
    }

    updateBudget(sumOfWorks : number) {
      this.tot_lav_int.text = sumOfWorks.toFixed(2)
      this.tot_lav_int_charge.text = (sumOfWorks * (100+this.charge.value)/100).toFixed(2)
    }

    recalculate() {
      var sumNoCharge = +this.tot_lav_int.text
      this.tot_lav_int_charge.text = (sumNoCharge * (100+this.charge.value)/100).toFixed(2)
      this._configuratorService.calculateBudget()
    }

}