import { Component, OnInit, Input } from '@angular/core';
import {Material} from '../../core/domain/material'

import {TextInput, NumberInput, DisabledInput} from '../../core/domain/common'

import {ConfiguratorService} from '../../core/services/configurator.service'
import {AccountManagerService} from '../../core/services/account-manager.service'


@Component({
  selector: 'app-material-picker',
  templateUrl: './material-picker.component.html',
  styleUrls: ['./material-picker.component.css']
})
export class MaterialPickerComponent implements OnInit {

  @Input() showPrices : boolean;
  selectedMaterialId : string;
  changed : boolean = false;
  materials: Material[] = []

  n_pieces : NumberInput
  client_name : TextInput
  budget_date : DisabledInput
  
  constructor(
    private _configuratorService : ConfiguratorService,
    private _accountManager : AccountManagerService) {     
  }

  ngOnInit() {
    this.budget_date = this._configuratorService.currentSession.budget_date 
    this.n_pieces = this._configuratorService.currentSession.n_pieces 
    this.client_name = this._configuratorService.currentSession.client_name 
  }

  updateMaterial(material: Material){   
    if (material) {
      console.log('new material ' + material) 
      this._configuratorService.selectMaterial(material)
    }
  }

  setChanged() {
    this._configuratorService.totalMaterialPriceChanged();
  }

  totalPiecesChanged() {
    this._configuratorService.totalMaterialPriceChanged();
  }
}