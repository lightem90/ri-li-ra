import { Component, OnInit } from '@angular/core';
import { TreeWorkNode } from '../core/domain/common';
import {WorkType, Work} from '../core/domain/work'
import { AccountManagerService } from '../core/services/account-manager.service';
import { WorkFactoryService } from '../core/services/work-factory.service';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.css']
})
export class UserLandingComponent implements OnInit {

  workTypes : string[] = []
  userWorks : Work[] = []
        
  constructor(
    private _accountService : AccountManagerService,
    private _workFactory : WorkFactoryService) { 
      
    this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')

    this._accountService
      .fetchInternalUserWorks()
      .then(res => this.userWorks = res)
  }

  ngOnInit() {
    
  }

  saveWorkForUser(workNodeToSave: TreeWorkNode){
    let work = new Work()
    work.mapFrom(workNodeToSave)

    this._accountService.saveWorkForUser(work).then(res => console.log(res))
  }

}