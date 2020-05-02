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

  saveMaterial() {
    this._accountManager.saveMaterialForCurrentUser(this.materials)
  }

  setChanged() {
    this.changed = true
    this._configuratorService.totalMaterialPriceChanged();
  }

  ngOnInit() {
    this.fetchMaterials()  
    this.budget_date = this._configuratorService.currentSession.budget_date 
    this.n_pieces = this._configuratorService.currentSession.n_pieces 
    this.client_name = this._configuratorService.currentSession.client_name 
  }

  async fetchMaterials(){
    //se non ci sono dati salvati dall'utente prendo i materiali di default
    this.materials = await this._configuratorService.getMaterials()  

    if (this.materials.length === 0) {
      this.materials = await this._configuratorService.getMaterials(true)
    }

    this.changed = false
  }

  getMaterialUrl(material: Material){
    return this._configuratorService.getAssetUrl(material.img_url)
  }

  udapteSelectedMaterial(material: any){
    this.selectedMaterialId = material
    var selMatIndex = this.materials.findIndex(m => m.uid === material)
    if (selMatIndex !== -1) {
      this._configuratorService.selectMaterial(this.materials[selMatIndex])
    }
  }

  totalPiecesChanged() {
    this._configuratorService.totalMaterialPriceChanged();
  }
}