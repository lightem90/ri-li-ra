import { Component, OnInit, Input } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, Work} from '../../core/domain/work'
import {IWorkTreeService, TreeWorkNode} from '../../core/domain/common'
import {WorkTreeService} from '../../core/services/work-tree.service'
import {WorkFactoryService} from '../../core/services/work-factory.service'

import { ConfiguratorService } from '../../core/services/configurator.service'

import {NumberInput, DisabledInput} from '../../core/domain/common'
import { AccountManagerService } from '../../core/services/account-manager.service';

@Component({
  selector: 'app-internal-works',
  templateUrl: './internal-works.component.html',
  styleUrls: ['./internal-works.component.css']
})
export class InternalWorksComponent implements OnInit {

    charge : NumberInput
    tot_lav_int : DisabledInput
    tot_lav_int_charge : DisabledInput

    workTypes = []
    userWorks : Work[] = []
    _userWorksLoaded : boolean = true;

    constructor(
      private _accountService : AccountManagerService,
      public _workFactory : WorkFactoryService,
      public _configuratorService : ConfiguratorService) {  
        
      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      // this._accountService
      // .fetchInternalUserWorks()
      // .then(r => {
      //   this.userWorks = r
      //   this._userWorksLoaded = true
      // })

      // this._accountService.worksChanged.subscribe(works => {
      //   this.userWorks = works
      // })
    }


    ngOnInit() {
      this.charge = this._configuratorService.currentSession.charge_lav_int;
      this.tot_lav_int = this._configuratorService.currentSession.tot_lav_int;
      this.tot_lav_int_charge = this._configuratorService.currentSession.tot_lav_int_charge;
    }

    updateBudget(sumOfWorks : number) {
      console.log("tree event: " + sumOfWorks)
      this.tot_lav_int.text = sumOfWorks.toFixed(2)
      this.tot_lav_int_charge.text = (sumOfWorks * (100+this.charge.value)/100).toFixed(2)
      
      this.recalculate()
    }

    recalculate() {
      console.log('recalculating from int work component')
      var sumNoCharge = +this.tot_lav_int.text
      this.tot_lav_int_charge.text = (sumNoCharge * (100+this.charge.value)/100).toFixed(2)
      
      this._configuratorService.calculateBudget()
    }

    updateInternalWorks(workNodes: TreeWorkNode[]) {
      //mettere una mappa se serve
      this._configuratorService.setInternalWorks(
        workNodes.map(n => new Work().mapFrom(n)))
    }

}