import { Component, OnInit, Input } from '@angular/core';

import {Budget} from '../../core/domain/budget'

import { ConfiguratorService } from '../../core/services/configurator.service'
import {DisabledInput, NumberInput} from '../../core/domain/common'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-piece-price',
  templateUrl: './piece-price.component.html',
  styleUrls: ['./piece-price.component.css']
})
export class PiecePriceComponent implements OnInit {

  constructor(private _configuratorService : ConfiguratorService) {

  }

  pieceChargePercentage : NumberInput
  pieceUnitaryPrice : DisabledInput
  tot_material_price : DisabledInput

  ngOnInit() {    
    this.pieceChargePercentage = this._configuratorService.currentSession.pieceChargePercentage
    this.pieceUnitaryPrice = this._configuratorService.currentSession.pieceUnitaryPrice
    this.tot_material_price = this._configuratorService.currentSession.tot_material_price
  }

  chargeForPieceChanged() {
    this._configuratorService.totalMaterialPriceChanged()
  }

}