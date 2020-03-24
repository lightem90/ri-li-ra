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
      .then(res => this.materials = res);
  }

  async getMaterialUrl(material: Material){
    return await this.configuratorService.getAssetUrl(material.img_url)
  }

}