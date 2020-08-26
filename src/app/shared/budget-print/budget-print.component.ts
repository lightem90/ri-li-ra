import { Component, OnInit } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  budgetDefinitio() {
    let docDefinition =  
    {
      content: [
        {text: 'Tables', style: 'header'},
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        {text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader'},
        'The following table has nothing more than a body array',
        {
          style: 'tableExample',
          table: {
            body: [
              ['Column 1', 'Column 2', 'Column 3'],
              ['One value goes here', 'Another one here', 'OK?']
            ]
          }
        }],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        },
        defaultStyle: {
          // alignment: 'justify'
        }
     }
     return docDefinition
  }

}