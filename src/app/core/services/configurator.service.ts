import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import { Budget } from '../domain/budget'
import { FirebaseHelper } from './firebase-helper'
import { BudgetCalculatorService } from './budget-calculator.service'
import { Material } from '../domain/material';
import { NumberInput } from '../domain/common';
import { Shape } from '../../core/domain/piece'
import { Work, ExternalWork } from '../domain/work';

@Injectable()
export class ConfiguratorService implements CanActivate {

  calculatorService : BudgetCalculatorService
  currentSession : Budget = null

  internalWorks : Work[] = []
  externalWorks : ExternalWork[] = []

  constructor(
    private firbaseHelper : FirebaseHelper, 
    private router: Router) { }
 
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

  recalcWeight() {
    //lascia al servizio gli if sul calcolo del peso a seconda del volume
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

    //calcolo tutto anche senza materiale (i default sono 0)
    if (this.currentSession.material === null) {
      this.calculateBudget()
      return;
    }

    const shape = this.currentSession.selectedShape
    const numberOfPieces = this.currentSession.n_pieces.value
    const pieceUnitaryWeight = +this.currentSession.totWeigthPerPiece.text
    const pricePerShape =  this.currentSession.material.prices_for_shape[shape]
    const unitaryPrice = pricePerShape * pieceUnitaryWeight

    const chargeOnPiece = this.currentSession.pieceChargePercentage.value
    const prezzoUnitarioConRicarico = unitaryPrice * (100+chargeOnPiece)/100

    this.currentSession.pieceUnitaryPrice.text = prezzoUnitarioConRicarico.toFixed(2)
    this.currentSession.totWeigth.text = (numberOfPieces * pieceUnitaryWeight).toFixed(2)
    this.currentSession.tot_material_price.text = (prezzoUnitarioConRicarico*numberOfPieces).toFixed(2)   

    this.calculateBudget()
  }

  //pubblico per ora, solo per le lavorazioni
  calculateBudget() {
    //valori solo in visualizzazione, il totale del preventivo è inserito dall'utente
    var prezzoMaterialAlPezzo = +this.currentSession.pieceUnitaryPrice.value
    var prezzoLavIntAlPezzo  = +this.currentSession.tot_lav_int_charge.value
    var prezzoLavExtAlPezzo  = +this.currentSession.tot_lav_ext.value

    this.currentSession.recap_pc_pz.text = (prezzoMaterialAlPezzo + prezzoLavIntAlPezzo + prezzoLavExtAlPezzo).toFixed(2)

    this.currentSession.recap_pce_pz.text = (prezzoMaterialAlPezzo + prezzoLavExtAlPezzo).toFixed(2)

    this.updateBudgetResult()
  }

  updateBudgetResult() {

    var pieceCount = this.currentSession.n_pieces.value
    var przComunicato = this.currentSession.recap_tot_prz.value
    var forceGain = this.currentSession.recap_tot_gain_perc.value

    var ricavo = przComunicato * pieceCount
    //calcolo il guadagno come differenza tra prezzo comunicato totale e costi totali
    if (forceGain === 0)
    {
      var costi = pieceCount * +this.currentSession.recap_pc_pz.text
      this.currentSession.recap_tot.text = (ricavo).toFixed(2)
      this.currentSession.recap_tot_gain.text = (ricavo-costi).toFixed(2)
    } else {
      //il guadagno è inserito in percentuale dall'utente
      var gain = (ricavo * forceGain / 100)

      this.currentSession.recap_tot.text = (ricavo+gain).toFixed(2)
      this.currentSession.recap_tot_gain.text = (gain).toFixed(2)
    }
  }

  setInternalWorks(works: Work[]){
    this.internalWorks = works
  }

  setExternalWorks(extWorks: ExternalWork[]){
    this.externalWorks = extWorks
  }


}