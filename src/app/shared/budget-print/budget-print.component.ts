import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-budget-print',
  templateUrl: './budget-print.component.html',
  styleUrls: ['./budget-print.component.css']
})
export class BudgetPrintComponent implements OnInit {

  _budgetId : string
  

  constructor(private _activatedroute : ActivatedRoute) {

    this._activatedroute.paramMap.subscribe(params => { 
      this._budgetId = params.get('id'); 
    });        
   }

  ngOnInit() {
    console.log("requested budget id: " + this._budgetId)
  }

}