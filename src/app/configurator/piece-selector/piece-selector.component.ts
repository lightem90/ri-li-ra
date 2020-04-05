import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';

import { Shape } from '../../core/domain/piece'
import { Budget } from '../../core/domain/budget'
import { TextInput, NumberInput } from '../../core/domain/common'

@Component({
  selector: 'app-piece-selector',
  templateUrl: './piece-selector.component.html',
  styleUrls: ['./piece-selector.component.css']
})
export class PieceSelectorComponent implements OnInit {

  @Input() budget : Budget
  shapes: Shape[]
  selectedShape : Shape = null
  inputs: NumberInput[] = []
  pieceSelector : FormGroup
  pdfSrc : string

  constructor(private _fb: FormBuilder) { 
    this.shapes = Object.values(Shape).filter(x => typeof x === 'string')  
    this.pieceSelector = this._fb.group({})
  }

  ngOnInit() { 
    this.selectedShape = this.shapes[0]
    this.updateInputs(this.selectedShape)
  }

  updateInputs(shape : Shape) {
    switch(Shape[shape]){
      case Shape.Quadrangular:
        this.inputs = [
          new NumberInput("Lunghezza", 0), 
          new NumberInput("Larghezza",  0), 
          new NumberInput("Spessore",  0)]
          break;
      case Shape.Cylinder:
        this.inputs = [
          new NumberInput("Diametro",  0), 
          new NumberInput("Lunghezza",  0), 
          new NumberInput("Presa",  0)]
        break;
      case Shape.CylinderTube:
      this.inputs = [
          new NumberInput("DiametroEsterno",  0), 
          new NumberInput("DiametroInterno",  0), 
          new NumberInput("Lunghezza",  0)]
        break;
      case Shape.QuadrangularTube:
        this.inputs = [
          new NumberInput("BaseEsterna",  0), 
          new NumberInput("AltezzaEsterna",  0), 
          new NumberInput("BaseInterna",  0),
          new NumberInput("AltezzaInterna",  0), 
          new NumberInput("Lunghezza",  0)]
        break;
      case Shape.Hexagonal:
      this.inputs = [
          new NumberInput("LunghezzaLato",  0), 
          new NumberInput("Lunghezza",  0)]
        break;
      case Shape.LAngular:
        this.inputs = [
          new NumberInput("Base",  0), 
          new NumberInput("Altezza",  0), 
          new NumberInput("Spessore",  0),
          new NumberInput("Lunghezza",  0)]
        break;
      case Shape.Sheet:
      this.inputs = [
          new NumberInput("Lunghezza",  0), 
          new NumberInput("Larghezza",  0), 
          new NumberInput("LunghezzaLastra",  0), 
          new NumberInput("LarghezzaLastra",  0),
          new NumberInput("SpessoreLastra",  0), 
          new NumberInput("DiametroFresa",  0), ]
        break;
      case Shape.SheetR:
        this.inputs = [
          new NumberInput("Diametro",  0), 
          new NumberInput("LunghezzaLastra",  0), 
          new NumberInput("LarghezzaLastra",  0),
          new NumberInput("SpessoreLastra",  0), 
          new NumberInput("DiametroFresa",  0), ]
        break;
      default:
        console.log("ERROR")
        break;
    }

    this.budget.selectedShape = this.selectedShape
    this.budget.shapeInputs = this.inputs
  }
}