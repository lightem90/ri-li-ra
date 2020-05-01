import { Component, OnInit, Input } from '@angular/core';
import {Material} from '../../core/domain/material'

import {TextInput, NumberInput, DisabledInput} from '../../core/domain/common'

import {ConfiguratorService} from '../../core/services/configurator.service'

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
  
  constructor(private _configuratorService : ConfiguratorService) {     
  }

  saveMaterial() {
    
  }

  setChanged() {
    this.changed = true
  }

  priceChanged() {
    return this.changed
  }

  ngOnInit() {
    this.fetchMaterials()  
    this.budget_date = this._configuratorService.currentSession.budget_date 
    this.n_pieces = this._configuratorService.currentSession.n_pieces 
    this.client_name = this._configuratorService.currentSession.client_name 
  }

  fetchMaterials(){
    this._configuratorService
      .getDefaultMaterials()
      .then(res => {
        if (res)
        {
          this.materials = res
          this.materials.forEach(mat => {            
            this._configuratorService
              .getAssetUrl(mat.img_url)
              .subscribe(res => {
                if (res) {
                  //to display correctly, first time img_url is the address stored into firebase
                  //second time is the downloadurl for the view
                  mat.img_url = res
                }
            })
          })     
        } else {
          console.log('Error fetching materials')
        }
      });
      this.changed = false;
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
    this._configuratorService.totalPiecesChanged();
  }
}