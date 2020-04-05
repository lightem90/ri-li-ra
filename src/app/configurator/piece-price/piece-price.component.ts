import { Component, OnInit, Input } from '@angular/core';

import {Budget} from '../../core/domain/budget'

import {TextInput, NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-piece-price',
  templateUrl: './piece-price.component.html',
  styleUrls: ['./piece-price.component.css']
})
export class PiecePriceComponent implements OnInit {

  @Input() budget : Budget

  pieceChargePercentage : NumberInput
  totWeigth : TextInput
  pieceUnitaryPrice : TextInput

  ngOnInit() {    
    this.pieceChargePercentage = this.budget.pieceChargePercentage
    this.totWeigth = this.budget.totWeigth
    this.pieceUnitaryPrice = this.budget.pieceUnitaryPrice
  }

}