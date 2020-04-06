import { Component, OnInit, Input } from '@angular/core';

import {Budget} from '../../core/domain/budget'

import { ConfiguratorService } from '../../core/services/configurator.service'
import {TextInput, NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-piece-price',
  templateUrl: './piece-price.component.html',
  styleUrls: ['./piece-price.component.css']
})
export class PiecePriceComponent implements OnInit {

  constructor(private _configuratorService : ConfiguratorService) {

  }

  pieceChargePercentage : NumberInput
  totWeigth : TextInput
  pieceUnitaryPrice : TextInput

  ngOnInit() {    
    this.pieceChargePercentage = this._configuratorService.currentSession.pieceChargePercentage
    this.totWeigth = this._configuratorService.currentSession.totWeigth
    this.pieceUnitaryPrice = this._configuratorService.currentSession.pieceUnitaryPrice
  }

}