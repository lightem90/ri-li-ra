import { Component, OnInit } from '@angular/core';
import {Material} from '../../core/domain/material'

@Component({
  selector: 'app-material-picker',
  templateUrl: './material-picker.component.html',
  styleUrls: ['./material-picker.component.css']
})
export class MaterialPickerComponent implements OnInit {

  selectedMaterialId : string;
  defaultSelected : string;

  materials: Material[]= [
    new Material("1", "aa", "bb"), 
    new Material("2", "cc", "dd")]
  constructor() { }

  ngOnInit() {
    this.defaultSelected = this.materials[0].id
  }

}