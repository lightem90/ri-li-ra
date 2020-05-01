import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import { Budget } from '../domain/budget'
import { FirebaseHelper } from './firebase-helper'
import { BudgetCalculatorService } from './budget-calculator.service'
import { Material } from '../domain/material';
import { NumberInput } from '../domain/common';
import { Shape } from '../../core/domain/piece'

@Injectable()
export class ConfiguratorService implements CanActivate {

  calculatorService : BudgetCalculatorService
  currentSession : Budget = null

  constructor(
    private firbaseHelper : FirebaseHelper, 
    private router: Router) { }


  getAssetUrl(assetUrl : string){
    //take 1 so i don't need to unsubscribe
    return this.firbaseHelper.getAssetSrc(assetUrl).pipe(take(1))
  }
  
  //needed to display configurator only if session has started, otherwise I'll show the button to start
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
      : Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSessionActive())
    {
      return true;
    }

    this.router.navigate(['/'])
    return false;
  }

  startNewSession() {
    //firebase
    this.currentSession = new Budget()
    this.calculatorService = new BudgetCalculatorService(this.currentSession)
  }

  isSessionActive(){
    return this.currentSession !== null
  }

  getDefaultMaterials(){
    return this.firbaseHelper.getDefaultMaterials();
  }

  recalcWeight() {
    this.calculatorService.recalcWeight()
    this.recalcMaterialPrice()
  }

  selectMaterial(materialSelected : Material) {    
    this.currentSession.material = materialSelected
    this.recalcWeight()
  }

  //è cambiato il numero di pezzi da preventivare, aggiornare i campi che servono
  totalMaterialPriceChanged() {
    this.recalcMaterialPrice()
  }

  updateShape(selectedShape: Shape, shapeInputs: NumberInput[]) {
    this.currentSession.selectedShape = selectedShape
    this.currentSession.shapeInputs = shapeInputs
    this.recalcWeight()
  }

  private recalcMaterialPrice(){
    if (this.currentSession.material === null) return;

    var numberOfPieces = this.currentSession.n_pieces.value
    var pieceUnitaryWeight = +this.currentSession.totWeigthPerPiece.text
    var unitaryPrice = this.currentSession.material.price_p * pieceUnitaryWeight

    var chargeOnPiece = this.currentSession.pieceChargePercentage.value
    var prezzoUnitarioConRicarico = unitaryPrice * (100+chargeOnPiece)/100

    this.currentSession.pieceUnitaryPrice.text = prezzoUnitarioConRicarico.toFixed(2)
    this.currentSession.totWeigth.text = (numberOfPieces * pieceUnitaryWeight).toFixed(2)
    this.currentSession.tot_material_price.text = (prezzoUnitarioConRicarico*numberOfPieces).toFixed(2)
    
  }

}