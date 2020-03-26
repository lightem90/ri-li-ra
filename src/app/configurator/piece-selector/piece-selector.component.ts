import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Shape } from '../../core/domain/piece'

@Component({
  selector: 'app-piece-selector',
  templateUrl: './piece-selector.component.html',
  styleUrls: ['./piece-selector.component.css']
})
export class PieceSelectorComponent implements OnInit {

  shapes: Shape[]
  selectedShape : Shape = null
  inputs: {label:string, value:number}[]

  constructor() { 
    this.inputs = [{label:"test", value:1}, {label:"test2", value:2}]
    this.shapes = Object.values(Shape).filter(x => typeof x === 'string')
    this.selectedShape = this.shapes[0]
  }

  ngOnInit() {
  }

  updateInputs() {
    this.inputs = []
  }

}