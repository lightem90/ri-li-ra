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
  }

  selectMaterial(materialSelected : Material) {    
    this.currentSession.material = materialSelected
  }

  //è cambiato il numero di pezzi da preventivare, aggiornare i campi che servono
  totalPiecesChanged() {

  }

  updateShape(selectedShape: Shape, shapeInputs: NumberInput[]) {
    this.currentSession.selectedShape = selectedShape
    this.currentSession.shapeInputs = shapeInputs
    this.recalcWeight()
  }

}