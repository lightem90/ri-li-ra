import {NumberInput, TextInput, DisabledInput} from "../domain/common"
import {Material} from '../domain/material';
import {Shape} from '../domain/piece';
import {Budget} from '../domain/budget'

export class BudgetCalculatorService {

  _pi = 3.14
  constructor(private _budget : Budget) { }

  recalcWeight() {
    //aggiungere validazione in grafica
    if (this._budget.selectedShape && this._budget.material) 
    {
      const selectedMaterialSpecWeight = this._budget.material.spec_weight
      let shapeResult = 0
      switch(Shape[this._budget.selectedShape]) {
        case Shape.Quadrangular:
            shapeResult = this._calculateQuadrangular()
            break;
        case Shape.Cylinder:
            shapeResult = this._calculateCylinder()
          break;
        case Shape.CylinderTube:
            shapeResult = this._calculateCylinderTube()
          break;
        case Shape.QuadrangularTube:
            shapeResult = this._calculateQuadrangularTube()
          break;
        case Shape.Hexagonal:
            shapeResult = this._calculateExagonal()
          break;
        case Shape.LAngular:
            shapeResult = this._calculateLAngular()
          break;
        case Shape.Sheet:
            shapeResult = this._calculateSheet()
          break;
        case Shape.SheetR:
            shapeResult = this._calculateSheetR()
          break;
        default:
          console.log("Error shape type: " + this._budget.selectedShape)
          return false
      }  
      const weightPerPiece = shapeResult * selectedMaterialSpecWeight / 1000000
      this._budget.totWeigthPerPiece.text = weightPerPiece.toString()
      console.log("Calculate: " + weightPerPiece)
      return true
    } else {
      return false
    }
  }

  _calculateQuadrangular() {
    return (this._budget.shapeInputs[0].value  + 5)
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

  _calculateCylinder() {
    let r = this._budget.shapeInputs[0].value  / 2
    let d = this._budget.shapeInputs[1].value + this._budget.shapeInputs[2].value
    return r * r * this._pi * d
  }

  _calculateCylinderTube() {
    let r = this._budget.shapeInputs[0].value  / 2
    let d = this._budget.shapeInputs[1].value + this._budget.shapeInputs[2].value
    //TODO: chiedere a richi
    return ((r * r * this._pi) - (d)) * d
  }

  _calculateQuadrangularTube() {
    return (this._budget.shapeInputs[0].value  + 5)
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

  _calculateExagonal() {
    let a = this._budget.shapeInputs[0].value + 5
    let h = this._budget.shapeInputs[1].value * this._budget.shapeInputs[1].value  * 0.866
    return a * h
  }

  _calculateLAngular() {
    return (this._budget.shapeInputs[0].value  + 5)
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

  _calculateSheet() {
    return (this._budget.shapeInputs[0].value  + 5)
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

  _calculateSheetR() {
    return (this._budget.shapeInputs[0].value  + 5)
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

}