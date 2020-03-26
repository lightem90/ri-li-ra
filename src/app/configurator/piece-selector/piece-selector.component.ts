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
  inputs: {label:string, value:number}[] = []

  constructor() { 
    this.shapes = Object.values(Shape).filter(x => typeof x === 'string')
    this.selectedShape = this.shapes[0]
    this.updateInputs(this.selectedShape)
  }

  ngOnInit() {
  }

  updateInputs(shape : Shape) {
    switch(Shape[shape]){
      case Shape.Quadrangular:
        this.inputs = [
          {label:"Lunghezza", value:0}, 
          {label:"Larghezza", value:0}, 
          {label:"Spessore", value:0}]
          break;
      case Shape.Cylinder:
        this.inputs = [
          {label:"Diametro", value:0}, 
          {label:"Lunghezza", value:0}, 
          {label:"Presa", value:0}]
        break;
      case Shape.CylinderTube:
      this.inputs = [
          {label:"DiametroEsterno", value:0}, 
          {label:"DiametroInterno", value:0}, 
          {label:"Lunghezza", value:0}]
        break;
      case Shape.QuadrangularTube:
        this.inputs = [
          {label:"BaseEsterna", value:0}, 
          {label:"AltezzaEsterna", value:0}, 
          {label:"BaseInterna", value:0},
          {label:"AltezzaInterna", value:0}, 
          {label:"Lunghezza", value:0}]
        break;
      case Shape.Hexagonal:
      this.inputs = [
          {label:"LunghezzaLato", value:0}, 
          {label:"Lunghezza", value:0}]
        break;
      case Shape.LAngular:
        this.inputs = [
          {label:"Base", value:0}, 
          {label:"Altezza", value:0}, 
          {label:"Spessore", value:0},
          {label:"Lunghezza", value:0}]
        break;
      case Shape.Sheet:
      this.inputs = [
          {label:"Lunghezza", value:0}, 
          {label:"Larghezza", value:0}, 
          {label:"LunghezzaLastra", value:0}, 
          {label:"LarghezzaLastra", value:0},
          {label:"SpessoreLastra", value:0}, 
          {label:"DiametroFresa", value:0}, ]
        break;
      case Shape.SheetR:
        this.inputs = [
          {label:"Diametro", value:0}, 
          {label:"LunghezzaLastra", value:0}, 
          {label:"LarghezzaLastra", value:0},
          {label:"SpessoreLastra", value:0}, 
          {label:"DiametroFresa", value:0}, ]
        break;
      default:
        console.log("ERROR")
        break;
    }
  }
}