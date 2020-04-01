import { Component, OnInit } from '@angular/core';

import {TextInput, NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-piece-price',
  templateUrl: './piece-price.component.html',
  styleUrls: ['./piece-price.component.css']
})
export class PiecePriceComponent implements OnInit {

  chargePercentage = new NumberInput("PercRic", 0)
  totWeigth = new TextInput("PesoTot", "NonCalc")
  unitaryPrice = new TextInput("CostoAlPz", "NonCalc")

  constructor() {
  }


  ngOnInit() {
  }

}