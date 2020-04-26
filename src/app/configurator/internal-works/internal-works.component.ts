import { Component, OnInit, Input } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, TreeWorkNode, TreeWorkFlatNode} from '../../core/domain/works'
import {IWorkTreeService} from '../../core/domain/common'
import {WorkTreeService} from '../../core/services/work-tree.service'
import {WorkFactoryService} from '../../core/services/work-factory.service'

import { ConfiguratorService } from '../../core/services/configurator.service'

import {NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-internal-works',
  templateUrl: './internal-works.component.html',
  styleUrls: ['./internal-works.component.css']
})
export class InternalWorksComponent implements OnInit {

    //stati per il combo
    workTypes: WorkType[]
    selectedWorkType : WorkType = null
    
    public treeService: WorkTreeService

    constructor(
      private _workFactory : WorkFactoryService,
      private _configuratorService : ConfiguratorService) {  

      this.treeService = new WorkTreeService(_workFactory)

      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      this.selectedWorkType = this.workTypes[0]
    }


    ngOnInit() {}

    addWork() {
      this.treeService.addWork(this.selectedWorkType.toString())
    }

    updateBudget() {
      console.log("Recalculate internal works")
    }

}