import { Component, OnInit, Input } from '@angular/core';
import {Material} from '../../core/domain/material'
import {Budget} from '../../core/domain/budget'

import {TextInput, NumberInput} from '../../core/domain/common'

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

  n_pieces = new NumberInput ("n_pieces", 0)
  client_name = new TextInput("client_name", "")

  @Input() budget : Budget
  
  constructor(private configuratorService : ConfiguratorService) { 
  }

  saveMaterial() {
    //todo update su db
    //parse string to int!
    // var x = "32";
    // var y = +x;
  }

  setChanged() {
    this.changed = true
  }

  priceChanged() {
    return this.changed
  }

  ngOnInit() {
    this.fetchMaterials()   
  }

  fetchMaterials(){
    this.configuratorService
      .getDefaultMaterials()
      .then(res => {
        if (res)
        {
          this.materials = res
          this.selectedMaterialId = this.materials[0].uid
          this.materials.forEach(mat => {            
            this.configuratorService
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
          console.log('error fetching materials')
        }
      });
      this.changed = false;
  }

  getMaterialUrl(material: Material){
    return this.configuratorService.getAssetUrl(material.img_url)
  }

  udapteSelectedMaterial(material: any){    
    this.selectedMaterialId = material

    //questo funziona solo perchè ad oggi i materiali hanno un uid che comincia da 1, se cambierà bisogna prendere l'indice del material nell'array

    this.budget.material = this.materials[+this.selectedMaterialId-1]
  }


}