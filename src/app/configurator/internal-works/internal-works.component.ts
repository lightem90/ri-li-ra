import { Component, OnInit } from '@angular/core';

import {WorkType} from '../../core/domain/works'

@Component({
  selector: 'app-internal-works',
  templateUrl: './internal-works.component.html',
  styleUrls: ['./internal-works.component.css']
})
export class InternalWorksComponent implements OnInit {

    workTypes: WorkType[]
    selectedWorkType : WorkType = null

    constructor() { 
      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      this.selectedWorkType = this.workTypes[0]
    }

    ngOnInit() {}

    addWork() {

    }

}