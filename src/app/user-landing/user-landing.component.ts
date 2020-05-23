import { Component, OnInit } from '@angular/core';
import { TreeWorkNode } from '../core/domain/common';
import {WorkType, Work, ExternalWork} from '../core/domain/work'
import { AccountManagerService } from '../core/services/account-manager.service';
import { WorkFactoryService } from '../core/services/work-factory.service';
import { ExternalWorkFactoryService } from '../core/services/externalwork-factory.service';
import { AccountService } from '../core/services/account.service';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.css']
})
export class UserLandingComponent implements OnInit {

  username : string = ""
  workTypes : string[] = []
  extWorkTypes : string[] = ["Personalizzato"]
  userWorks : Work[] = []
  _userWorksLoaded : boolean = false
  userExtWorks : ExternalWork[] = []
  _userExtWorksLoaded : boolean = false
  _userBudgets : any[] = []
  _budgetsLoaded : boolean = false
        
  constructor(
    private _service : AccountService,
    private _accountService : AccountManagerService,
    private _workFactory : WorkFactoryService,
    private _extWorkFactory : ExternalWorkFactoryService) { 
      
    this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
    this._accountService
      .fetchInternalUserWorks()
      .then(r => {
        this.userWorks = r
        this._userWorksLoaded = true
      })

    this._accountService
      .fetchExternalUserWorks()
      .then(r => {
        this.userExtWorks = r
        this._userExtWorksLoaded = true
      })
  }

  ngOnInit() {
    this.username = this._service.token    

    this._accountService
      .fetchUserBudgets()
      .then(r => {
        this._userBudgets = r
        this._budgetsLoaded = true
    })
  }

  saveWorkForUser(workNodeToSave: TreeWorkNode){
    let work = new Work()
    work.mapFrom(workNodeToSave)

    this._accountService.saveWorkForUser(work).then(res => console.log(res))
  }

  saveExtWorkForUser(workNodeToSave: TreeWorkNode){
    let work = new ExternalWork()
    work.mapFrom(workNodeToSave)

    this._accountService.saveExternalWorkForUser(work).then(res => console.log(res))
  }

  removeExtWorkForUser(workNodeToRemove: TreeWorkNode) {
    const s = this.userExtWorks.find(w => w.name === workNodeToRemove.name)
    if (s !== null){
      console.log("deleting: " + s)
      this._accountService.deleteUserService(s.uid)
    }
  }

  removeWorkForUser(workNodeToRemove: TreeWorkNode) {
    const w = this.userWorks.find(w => w.name === workNodeToRemove.name)
    if (w !== null){
      console.log("deleting: " + w)
       this._accountService.deleteUserWork(w.uid)
    }
  }

  logout() {
    this._service.logout()
  }

}