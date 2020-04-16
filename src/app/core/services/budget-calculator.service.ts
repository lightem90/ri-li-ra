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
    } 
    return false
  }

  //ok
  _calculateQuadrangular() {
    let spessLama = this._budget.shapeInputs[3].value
    let h10 = this._budget.shapeInputs[0].value
    let c16 = this._budget.shapeInputs[1].value
    let d16 = this._budget.shapeInputs[2].value
    let b16 = h10 + spessLama
    return b16 * c16 * d16
  }

  //ok
  _calculateCylinder() {
    let b17 = this._budget.shapeInputs[0].value  / 2
    let c17 = this._budget.shapeInputs[1].value + this._budget.shapeInputs[2].value
    return b17 * b17 * this._pi * c17
  }

  //ok
  _calculateCylinderTube() {
    let b18 = this._budget.shapeInputs[0].value  / 2
    let c18 = this._budget.shapeInputs[2].value + this._budget.shapeInputs[3].value
    let h11 = this._budget.shapeInputs[1].value
    return (((b18*b18*this._pi)-((h11/2)*(h11/2)*this._pi))*c18)
  }

  //ok
  _calculateQuadrangularTube() {
    let spessLama = this._budget.shapeInputs[2].value
    let h10 = this._budget.shapeInputs[4].value
    let b19 = h10 + spessLama
    let c19 = this._budget.shapeInputs[0].value
    let d19 = this._budget.shapeInputs[1].value
    let h11 = this._budget.shapeInputs[2].value
    let i11 = this._budget.shapeInputs[3].value

    return (b19*c19*d19)-(b19*h11*i11)
  }

  //ok
  _calculateExagonal() {
    let spessLama = this._budget.shapeInputs[2].value
    let h = this._budget.shapeInputs[0].value + spessLama
    let a = this._budget.shapeInputs[1].value * this._budget.shapeInputs[1].value  * 0.866
    return a * h
  }

  //ok
  _calculateLAngular() {
    let spessLama = this._budget.shapeInputs[4].value
    let h10 = this._budget.shapeInputs[3].value
    let b21 = spessLama + h10
    let h13 = this._budget.shapeInputs[0].value
    let i13 = this._budget.shapeInputs[1].value
    let d21 = this._budget.shapeInputs[2].value
    let c21 = i13 - d21

    return ((h13*d21)+(c21*d21))*b21
  }

  _calculateSheet() {
    let h10 = this._budget.shapeInputs[0].value    
    let i10 = this._budget.shapeInputs[1].value
    let b25 = this._budget.shapeInputs[2].value
    let c25 = this._budget.shapeInputs[3].value
    let d25 = this._budget.shapeInputs[4].value
    let diamFresa = this._budget.shapeInputs[5].value
    let b26 = Math.floor(b25/(h10+diamFresa))
    let c26 = Math.floor(c25/(i10+diamFresa))
    let numPezzi = b26 * c26 //cosa fare? aggiornare quelli del budget?
    console.log("Numero di pezzi nesting: " + numPezzi)

    //volume della lastra
    return (b25*c25*d25)
  }

  _calculateSheetR() {
    let diamFresa = this._budget.shapeInputs[4].value
    let r = this._budget.shapeInputs[0].value / 2
    let b25 = this._budget.shapeInputs[1].value
    let c25 = this._budget.shapeInputs[2].value
    let d25 = this._budget.shapeInputs[3].value

    //area lastra diviso area pezzo "tondo"
    let areaPezzoTondo = this._pi * 2 * (r*r)
    let areaFresa = this._pi * 4 * (diamFresa*diamFresa)
    let numPezzi = Math.floor((b25*c25)/(areaPezzoTondo+areaFresa))
    console.log("Numero di pezzi nesting: " + numPezzi)

    //volume della lastra
    return (b25*c25*d25)
  }

}