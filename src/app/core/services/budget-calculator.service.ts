import {NumberInput, TextInput, DisabledInput} from "../domain/common"
import {Material} from '../domain/material';
import {Shape} from '../domain/piece';
import {Budget} from '../domain/budget'

export class BudgetCalculatorService {

  constructor(private _budget : Budget) { }

  recalcWeight() {
    //aggiungere validazione i
  if (this._budget.selectedShape && this._budget.material) 
    {
      const selectedMaterialSpecWeight = this._budget.material.spec_weight
      let shapeResult = 0
      switch(Shape[this._budget.selectedShape]) {
        case Shape.Quadrangular:
            shapeResult = this._calculateQuadrangular()
            break;
        case Shape.Cylinder:
          break;
        case Shape.CylinderTube:
          break;
        case Shape.QuadrangularTube:
          break;
        case Shape.Hexagonal:
          break;
        case Shape.LAngular:
          break;
        case Shape.Sheet:
          break;
        case Shape.SheetR:
          break;
        default:
          console.log("Error shape type: " + this._budget.selectedShape)
          break;
      }  
      const weightPerPiece = shapeResult * selectedMaterialSpecWeight / 1000000
      this._budget.totWeigthPerPiece.text = weightPerPiece.toString()
      console.log("Calculate: " + weightPerPiece)
    }
  }

  _calculateQuadrangular() {
    return this._budget.shapeInputs[0].value 
          * this._budget.shapeInputs[1].value 
          * this._budget.shapeInputs[2].value
  }

}