import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AccountManagerService } from '../../core/services/account-manager.service';

@Component({
  selector: 'app-budget-print',
  templateUrl: './budget-print.component.html',
  styleUrls: ['./budget-print.component.css']
})
export class BudgetPrintComponent implements OnInit {

  _budgetId : string
  _loadingSuccessfull = false;
  _budget : any 

  constructor(
    private _activatedroute : ActivatedRoute,
    private _accountManager : AccountManagerService) {

    // this._activatedroute.paramMap.subscribe(params => { 
    //   this._budgetId = params.get('id'); 
    // });        
   }

  async ngOnInit() {
    // console.log("requested budget id: " + this._budgetId)
    // const allSavedBudgets = await this._accountManager.fetchUserBudgets()
    // console.log(allSavedBudgets)
    // this._budget = allSavedBudgets.find(b => b.uid === this._budgetId)
    // if (this._budget){
    //   this._loadingSuccessfull = true
    //   console.log("budget to print found")
    //   }  
  }

}