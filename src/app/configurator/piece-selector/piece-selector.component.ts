import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';

import { Shape } from '../../core/domain/piece'
import { Budget } from '../../core/domain/budget'
import { TextInput, NumberInput, DisabledInput } from '../../core/domain/common'

import { ConfiguratorService } from '../../core/services/configurator.service'

@Component({
  selector: 'app-piece-selector',
  templateUrl: './piece-selector.component.html',
  styleUrls: ['./piece-selector.component.css']
})
export class PieceSelectorComponent implements OnInit {

  shapes: Shape[]
  selectedShape : Shape = null
  inputs: NumberInput[] = []
  pieceSelector : FormGroup
  pdfSrc : string
  totWPerPiece : DisabledInput

  constructor(
    private _fb: FormBuilder, 
    private _configuratorService: ConfiguratorService) { 
    this.shapes = Object.values(Shape).filter(x => typeof x === 'string')  
    this.pieceSelector = this._fb.group({})
  }

  ngOnInit() { 
    this.selectedShape = this.shapes[0]
    this.updateInputs(this.selectedShape)
    this.totWPerPiece = this._configuratorService.currentSession.totWeigthPerPiece
  }

  updateInputs(shape : Shape) {
    switch(Shape[shape]){
      case Shape.Quadrangular:
        this.inputs = this.quadrangularInputs
          break;
      case Shape.Cylinder:
        this.inputs = this.cylinderInputs
        break;
      case Shape.CylinderTube:
      this.inputs = this.cylinderTubeInputs
        break;
      case Shape.QuadrangularTube:
        this.inputs = this.quadrangularTube
        break;
      case Shape.Hexagonal:
      this.inputs = this.exagonal
        break;
      case Shape.LAngular:
        this.inputs = this.lAngular
        break;
      case Shape.Sheet:
      this.inputs = this.sheetInputs
        break;
      case Shape.SheetR:
        this.inputs = this.sheetRInputs
        break;
      default:
        console.log("Error shape type: " + shape)
        break;
    }

    this._configuratorService.updateShape(this.selectedShape, this.inputs)
  }

  //l'oggetto di dominio BUDGET è direttamente bindato in interfaccia, quindi basta fare recalc dell'oggetto tramite service (così è più facile da cambiare se si vuole cambiare la logica)
  recalcWeight() {
    this._configuratorService.recalcWeight()
  }

  //In questo modo switchando il tipo si mantengono i valori
  quadrangularInputs = [
          new NumberInput("Lunghezza", 0), 
          new NumberInput("Larghezza",  0), 
          new NumberInput("Spessore",  0),
          new NumberInput("LamaTaglio", 5)]

  cylinderInputs = [
          new NumberInput("Diametro",  0), 
          new NumberInput("Lunghezza",  0), 
          new NumberInput("Presa",  0)]

  cylinderTubeInputs = [
          new NumberInput("DiametroEsterno",  0), 
          new NumberInput("DiametroInterno",  0), 
          new NumberInput("Lunghezza",  0), 
          new NumberInput("Presa",  0)]

  quadrangularTube = [
          new NumberInput("BaseEsterna",  0), 
          new NumberInput("AltezzaEsterna",  0), 
          new NumberInput("BaseInterna",  0),
          new NumberInput("AltezzaInterna",  0), 
          new NumberInput("Lunghezza",  0),
          new NumberInput("LamaTaglio", 5)]

  exagonal = [
          new NumberInput("LunghezzaLato",  0), 
          new NumberInput("Lunghezza",  0),
          new NumberInput("LamaTaglio", 5)]

  lAngular = [
          new NumberInput("Base",  0), 
          new NumberInput("Altezza",  0), 
          new NumberInput("Spessore",  0),
          new NumberInput("Lunghezza",  0),
          new NumberInput("LamaTaglio", 5)]

  sheetInputs = [
          new NumberInput("Lunghezza",  0), 
          new NumberInput("Larghezza",  0), 
          new NumberInput("LunghezzaLastra",  0), 
          new NumberInput("LarghezzaLastra",  0),
          new NumberInput("SpessoreLastra",  0), 
          new NumberInput("DiametroFresa",  0), ]

  sheetRInputs = [
          new NumberInput("Diametro",  0), 
          new NumberInput("LunghezzaLastra",  0), 
          new NumberInput("LarghezzaLastra",  0),
          new NumberInput("SpessoreLastra",  0), 
          new NumberInput("DiametroFresa",  0), ]

        
}