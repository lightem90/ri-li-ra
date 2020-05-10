import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {Material} from '../../core/domain/material'

import {TextInput, NumberInput, DisabledInput} from '../../core/domain/common'

import {ConfiguratorService} from '../../core/services/configurator.service'
import {AccountManagerService} from '../../core/services/account-manager.service'

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit {

  @Input() showPrices : boolean;
  @Output() selectedMaterialChanged = new EventEmitter<Material>()
  @Output() signalChanged = new EventEmitter()
  selectedMaterialId : string;
  changed : boolean = false;
  materials: Material[] = []
  
  constructor(
    private _configuratorService : ConfiguratorService,
    private _accountManager : AccountManagerService) {     
  }

  saveMaterial() {
    this._accountManager.saveMaterialForCurrentUser(this.materials)
  }

  ngOnInit() {    
    this.fetchMaterials()  
  }

  setChanged() {
    this.changed = true
    this._configuratorService.totalMaterialPriceChanged();
    this.signalChanged.emit()
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
      this.selectedMaterialChanged.emit(this.materials[selMatIndex])
    }
  }

}