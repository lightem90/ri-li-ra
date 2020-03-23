import { Component, OnInit, Input } from '@angular/core';

import {Material} from '../../../core/domain/material'

@Component({
  selector: 'app-material-picker-item',
  templateUrl: './material-picker-item.component.html',
  styleUrls: ['./material-picker-item.component.css']
})
export class MaterialPickerItemComponent implements OnInit {

  @Input()
  material : Material
  constructor() { }

  ngOnInit() {
  }

}