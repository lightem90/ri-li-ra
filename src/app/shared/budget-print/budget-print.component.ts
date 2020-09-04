import { Component, OnInit } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { ActivatedRoute } from '@angular/router';
import { AccountManagerService } from '../../core/services/account-manager.service';
import { SuperficialWorkType } from '../../core/domain/work';

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

     this._activatedroute.paramMap.subscribe(params => { 
       this._budgetId = params.get('id'); 
     });        
   }

  async ngOnInit() {
    console.log("requested budget id: " + this._budgetId)
    const allSavedBudgets = await this._accountManager.fetchUserBudgets()
    console.log(allSavedBudgets)
    this._budget = allSavedBudgets.find(b => b.uid === this._budgetId)
    if (this._budget){
        this._loadingSuccessfull = true
        console.log("budget to print found")
        //https://pdfmake.github.io/docs/getting-started/client-side/methods/
        pdfMake.createPdf(this.budgetDefinition()).open();
    }  

  }

  budgetDefinition() {
    let works = []

    let p = this._budget.pieces
    let tot_w_cost = 0
    if (this._budget.works) {
      works.push(['CENTRO DI COSTO', 'MINUTI AL PEZZO', 'MINUTI TOTALI', 'COSTO TOTALE (€)'])
      for (let w of this._budget.works) {
        works.push([w.name, w.tempo_totale / p, w.tempo_totale, w.costo_totale])
        tot_w_cost += w.costo_totale
      }
    }

    let ext_services = []
    let tot_ext_cost = 0
    let tot_t_cost = 0
    if (this._budget.services) {
      ext_services.push(['SERVIZI ESTERNI','COSTO TOTALE'])
      for (let e of this._budget.services) {
        ext_services.push([e.name, e.costo_totale])
        tot_ext_cost += e.costo_totale
        if (SuperficialWorkType[e.name] !== null)
        {
          tot_t_cost += e.costo_totale
        }
      }
    }

    let docDefinition =  
    {
      content: 
      [        
        {
          //intestazione
          style: 'tableExample',
          table: {
            border: [false, false, false],
            widths: [200, '*', 200],
            body: [
              [{text: 'M.Conti', style: 'tableHeader', alignment: 'center'},
               '', 
               {text: 'Spettabile \n Cliente: ' + this._budget.client_name, style: 'tableHeader', alignment: 'center'}],
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
                        this._budget.client_code,
                        this._budget.client_name,
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        },
        {
          //info
            style: 'tableExample',
            table: {
            border: [false, false, false],
              widths: [200, '*', 200],
              body: [
                [{text: 'N.Lotto pezzi', style: 'tableHeader', alignment: 'center'},
                '',
                {text: 'DATA', style: 'tableHeader', alignment: 'center'}],
                [
                  this._budget.pieces,
                  '',
                  this._budget.date
                ]
              ]
          }
        },
        {
          //pezzo e materiale
          style: 'tableExample',
          table: {
            border: [false, false, false, false],
            widths: ['auto', 'auto', 'auto','auto'],
            body: [
              [{text: 'Tipo materiale', style: 'tableHeader', alignment: 'center'},
                {text: 'Forma materiale', style: 'tableHeader', alignment: 'center'},
                {text: 'Peso totale', style: 'tableHeader', alignment: 'center'},
                {text: 'Dimensioni', style: 'tableHeader', alignment: 'center'}],
                [{text: this._budget.material_name, style: 'tableHeader', alignment: 'center'},
                {text: this._budget.shape, style: 'tableHeader', alignment: 'center'},
                {text: this._budget.weigth, style: 'tableHeader', alignment: 'center'},
                {text: this._budget.shape_measures
                  .map(m => m.name)
                  .join("x"), style: 'tableHeader', alignment: 'center'}]
            ]    
          }
        },
        {
          //lavorazioni
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto'],
            body: works    
          }
        },
        {
          //servizi
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto'],
            body: ext_services    
          }
        },
        {
          //riepilogo (no tab)
          columns: 
          [{
            type: 'none',
            ul: [
                'COSTO MATERIA PRIMA AL PEZZO',
                'COSTO LAVORAZIONI INTERNE AL PEZZO',
                'COSTO TRATTAMENTI AL PEZZO',
                'COSTO LAVORAZIONI ESTERNE AL PEZZO',
                '',
                'COSTO TOTALE AL PEZZO',
                '',
                'PREZZO AL CLIENTE',
                ''
            ]
          },
          {
            type: 'none',
            ul: [
                this._budget.material_price_piece,
                tot_w_cost / p,
                tot_ext_cost / p,
                tot_t_cost / p,
                '',
                this._budget.total_cost_piece,
                '',
                this._budget.client_price,
                ''
            ]
          },
          {
            type: 'none',
            ul: [
                'COSTO MATERIA PRIMA LOTTO',
                'COSTO LAVORAZIONI INTERNE LOTTO',
                'COSTO TRATTAMENTI LOTTO',
                'COSTO LAVORAZIONI ESTERNE LOTTO',
                '',
                'COSTO TOTALE LOTTO',
                '',
                'TOTALE FATTURATO',
                'TOTALE GUADAGNO'
            ]
          },
          {
            type: 'none',
            ul: [
                this._budget.material_price,
                tot_w_cost,
                tot_ext_cost,
                tot_t_cost,
                '',
                this._budget.total_cost,
                '',
                this._budget.revenue,
                this._budget.gain
            ]
          }
          ]}
      ]
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