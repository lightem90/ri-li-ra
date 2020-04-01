import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, TreeWorkNode, TreeWorkFlatNode} from '../../core/domain/works'
import {WorkTreeService} from '../../core/services/work-tree.service'

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

    constructor(private _treeService: WorkTreeService) { 
      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      this.selectedWorkType = this.workTypes[0]
    }


    ngOnInit() {}

    addWork() {
      this._treeService.addWork(this.selectedWorkType)
    }

}