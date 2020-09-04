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

    //https://pdfmake.github.io/docs/getting-started/client-side/methods/
    pdfMake.createPdf(this.budgetDefinition()).open();
  }

  budgetDefinition() {
    let docDefinition =  
    {
      content: [        
        {
          style: 'tableExample',
          table: {
            widths: [200, '*', 200],
            body: [
              [{text: 'M.Conti', style: 'tableHeader', alignment: 'center'},
               '', 
               {text: 'Spettabile \n Cliente: ' + "client_name", style: 'tableHeader', alignment: 'center'}],
              [{text: 'M.Conti s.r.l.\n via Brigata G.A.P. 17\n61122 Pesaro', style: 'tableHeader', alignment: 'left'}, 
              '', 
                {
                  columns: [
                  {
                    type: 'none',
                    ul: [
                        'CODICE',
                        'RIFERIMENTO',
                    ]
                  },
                  {
                    type: 'none',
                    ul: [
                        'T00R293934',
                        'G.GABELLINI',
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        },
        {
            style: 'tableExample',
            table: {
              widths: [200, '*', 200],
              body: [
                [{text: 'N.Lotto pezzi', style: 'tableHeader', alignment: 'center'},
                '',
                {text: 'DATA', style: 'tableHeader', alignment: 'center'}],
                [
                  'TODO lotto pezzi',
                  '',
                  'TODO data'
                ]
              ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto','auto'],
            body: [
              [{text: 'Tipo materiale', style: 'tableHeader', alignment: 'center'},
                {text: 'Forma materiale', style: 'tableHeader', alignment: 'center'},
                {text: 'Peso totale', style: 'tableHeader', alignment: 'center'},
                {text: 'Dimensioni', style: 'tableHeader', alignment: 'center'}],
                [{text: 'Tipo TODO', style: 'tableHeader', alignment: 'center'},
                {text: 'Forma TODO', style: 'tableHeader', alignment: 'center'},
                {text: 'Peso TODO', style: 'tableHeader', alignment: 'center'},
                {text: 'Dimensioni TODO', style: 'tableHeader', alignment: 'center'}]
            ]
    
        }
        }]
        ,
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