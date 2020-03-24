import { Component, OnInit, AfterViewInit } from '@angular/core';
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
    this.fetchMaterials()   
  }

  ngOnInit() {
  }

  fetchMaterials(){
    this.configuratorService
      .getDefaultMaterials()
      .then(res => {
        if (res)
        {
          this.materials = res
          this.defaultSelected = this.materials[0].name        
        } else {
          console.log('error fetching materials')
        }
      });
  }

  getMaterialUrl(material: Material){
    return this.configuratorService.getAssetUrl(material.img_url)
  }

}