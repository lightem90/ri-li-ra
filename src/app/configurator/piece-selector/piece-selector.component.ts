import { Component, OnInit } from '@angular/core';

import { Shape } from '../../core/domain/piece'

@Component({
  selector: 'app-piece-selector',
  templateUrl: './piece-selector.component.html',
  styleUrls: ['./piece-selector.component.css']
})
export class PieceSelectorComponent implements OnInit {

  shapes: Shape[]
  selectedShape : Shape = null
  constructor() { 
    this.shapes = Object.values(Shape).filter(x => typeof x === 'string')
    this.selectedShape = this.shapes[0]
  }

  ngOnInit() {
  }

}