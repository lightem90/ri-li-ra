import { Component, OnInit } from '@angular/core';
import {Material} from '../../core/domain/material'

import {ConfiguratorService} from '../../core/services/configurator.service'

@Component({
  selector: 'app-material-picker',
  templateUrl: './material-picker.component.html',
  styleUrls: ['./material-picker.component.css']
})
export class MaterialPickerComponent implements OnInit {

  selectedMaterialId : string;
  defaultSelected : string;

  materials: Material[] = []
  
  constructor(private configuratorService : ConfiguratorService) { 
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
          console.log(res)
          this.materials = res
          this.defaultSelected = this.materials[0].uid
          this.materials.forEach(mat => {            
            this.configuratorService.getAssetUrl(mat.img_url).subscribe(res => {
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
  }

  getMaterialUrl(material: Material){
    return this.configuratorService.getAssetUrl(material.img_url)
  }

  udapteSelectedMaterial(material: any){    
    this.selectedMaterialId = material
  }


}