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
import { FirebaseConstant } from './firebase-constant';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ConfiguratorService implements CanActivate {

  calculatorService : BudgetCalculatorService
  currentSession : Budget = null

  internalWorks : Work[] = []
  externalWorks : ExternalWork[] = []

  constructor(
    private toastr: ToastrService,
    private firebaseHelper : FirebaseHelper, 
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

    console.log('calculating material price')
    //calcolo tutto anche senza materiale (i default sono 0)
    if (this.currentSession.material === null) {
      console.log('no material available')
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
    
    const przStr = prezzoUnitarioConRicarico.toFixed(2)
    const changed = this.currentSession.pieceUnitaryPrice.text !== przStr
    this.currentSession.pieceUnitaryPrice.text = przStr
    
    console.log("Unitary price: " + unitaryPrice)
    
    if (changed && prezzoUnitarioConRicarico > 0) {
      this.toastr.success("Costo del materiale: " + przStr)
    }

    this.currentSession.tot_material_price.text = (prezzoUnitarioConRicarico*numberOfPieces).toFixed(2)   
    console.log('tot material price: ' + (prezzoUnitarioConRicarico*numberOfPieces).toFixed(2))
    this.calculateBudget()
  }

  //pubblico per ora, solo per le lavorazioni
  calculateBudget() {
    console.log('calculating budget')
    //valori solo in visualizzazione, il totale del preventivo è inserito dall'utente
    var prezzoMaterialAlPezzo = +this.currentSession.pieceUnitaryPrice.text
    var prezzoLavIntAlPezzo  = +this.currentSession.tot_lav_int_charge.text
    var prezzoLavExtAlPezzo  = +this.currentSession.tot_lav_ext.text

    console.log('tot lav int: ' + prezzoLavIntAlPezzo)
    console.log('tot lav ext: ' + prezzoLavExtAlPezzo)

    const newVal = (prezzoMaterialAlPezzo + prezzoLavIntAlPezzo + prezzoLavExtAlPezzo).toFixed(2)
    const notify = newVal !== this.currentSession.recap_pc_pz.text && +newVal > 0
    
    this.currentSession.recap_pc_pz.text = newVal
    this.currentSession.recap_pce_pz.text = (prezzoMaterialAlPezzo + prezzoLavExtAlPezzo).toFixed(2)
    this.updateBudgetResult(notify)
  }

  updateBudgetResult(notify: boolean, forcedGain : number = -1) {

    console.log('calcolating result')
    var pieceCount = this.currentSession.n_pieces.value
    var przComunicato = this.currentSession.recap_tot_prz.value

    var costoTotaleAlPezzo = +this.currentSession.recap_pc_pz.text    //costo totale comprese di tutte le lavorazioni
    
    if (notify) {
      this.toastr.success("Costo totale del pezzo: " + costoTotaleAlPezzo)
    }
    //calcolo il guadagno come differenza tra prezzo comunicato totale e costi totali
    if (forcedGain <= 0) {
      var fatturato = przComunicato * pieceCount                              //fatturato totale
      var costi = pieceCount * costoTotaleAlPezzo                             //costo totale

      var guadagno = fatturato-costi
      var guadagnoPerc = fatturato > 0 ? 100*guadagno/fatturato : 0
      
      this.currentSession.recap_tot.text = fatturato.toFixed(2)
      this.currentSession.recap_tot_gain.text = guadagno.toFixed(2)  
      this.currentSession.recap_tot_gain_perc.text = guadagnoPerc.toFixed(2)

    } else { //NON PIU' USATO!
      console.log("ERRORE DI CALCOLO, FUNZIONE NON SUPPORTATA")
      //per evitare comportamenti indesiderati se in serisco un guadagno percentuale >= 100
      let denominator = (1- (forcedGain/100))
      if (denominator <= 0) denominator = 1

      //il guadagno è inserito in percentuale dall'utente
      var ricavoTotaleAlPezzo = costoTotaleAlPezzo / denominator
      //aggiorno anche il prezzo comunicato (che sarà uguale al totale del preventivo)
      this.currentSession.recap_tot_prz.value = ricavoTotaleAlPezzo //prezzo comunicato (al pz)
      
      const ricavoTot = ricavoTotaleAlPezzo * pieceCount
      this.currentSession.recap_tot.text = (ricavoTotaleAlPezzo * pieceCount).toFixed(2)     //totale preventivo
      
      const guadagnoTotale = ricavoTot * forcedGain / 100
      this.currentSession.recap_tot_gain.text = (guadagnoTotale).toFixed(2)       //totale guadagno
      
      console.log('Forcing gain: ' + forcedGain + ', result: ' + (ricavoTotaleAlPezzo).toFixed(2) + " al pezzo")
    }
    
  }

  setInternalWorks(works: Work[]){
    this.internalWorks = works
  }

  setExternalWorks(extWorks: ExternalWork[]){
    this.externalWorks = extWorks
  }

  print() {
  }

  save() {
    this.firebaseHelper.addOrUpdateDataForUser(
      this.currentSession.mapToDb(this.internalWorks, this.externalWorks),
      FirebaseConstant.relationTableNames.userBudget)
  }


}