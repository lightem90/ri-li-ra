import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-piece-price',
  templateUrl: './piece-price.component.html',
  styleUrls: ['./piece-price.component.css']
})
export class PiecePriceComponent implements OnInit {

  chargePercentage: {label:string, value:number}
  totWeigth: {label:string, text: string}
  unitaryPrice: {label:string, text: string}

  constructor() {
    this.chargePercentage = {label:"PercRic", value:0}
    this.totWeigth = {label:"PesoTot", text:"NonCalc"}
    this.unitaryPrice = {label:"CostoAlPz", text:"NonCalc"}
   }


  ngOnInit() {
  }

}