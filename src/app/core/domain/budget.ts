import {NumberInput, TextInput, DisabledInput} from "./common"
import {Material} from './material';
import {Shape} from './piece';

import {BehaviorSubject} from 'rxjs';
import { Work, ExternalWork } from "./work";

//todo
export class BudgetRecap {

  constructor(
    public recap_tot_prz = new NumberInput ("PrezzoAlPz", 0),
    public recap_tot_gain_perc = new NumberInput ("TotGainPerc", 0),
    public recap_tot = new TextInput("TotConf", "0"),
    public recap_tot_gain = new TextInput("TotGain", "0"),
    public recap_pc_pz = new TextInput("PrezzoCostoAlPz", "0"),
    public recap_pce_pz = new TextInput("TotAlPzExtAlPz", "0")) {

    }
}

//dominio per l'interfaccia..
export class Budget {

  public pdfSubject = new BehaviorSubject<string>("");  

  public get pdfData(): string { return this.pdfSubject.value; }

  constructor(
    public uid: string = "",
    public customer: string = "",
    public customerDetail: string = "",
    public material: Material = null,
    public budget_date : DisabledInput = null,
    public n_pieces = new NumberInput ("n_pieces", 1),
    public client_name = new TextInput("client_name", ""),
    public client_code = new TextInput("client_code", ""),
    public pieceChargePercentage = new NumberInput("PercRic", 0),
    public totWeigthPerPiece = new TextInput("PesoTotPerPz", "0"),
    public nestingResult = new TextInput("NestingRes", "0"),    
    public totWeigth = new TextInput("PesoTot", "0"),
    public pieceUnitaryPrice = new TextInput("CostoAlPz", "0"),    
    public tot_material_price = new TextInput("CostoTotaleMateriaPrima", "0"),
    public recap_tot_prz = new NumberInput ("PrezzoAlPz", 0),
    public recap_tot_gain_perc = new NumberInput ("TotGainPerc", 0),
    public recap_tot = new TextInput("TotConf", "0"),
    public recap_tot_gain = new TextInput("TotGain", "0"),
    public recap_pc_pz = new TextInput("PrezzoCostoAlPz", "0"),
    public recap_pce_pz = new TextInput("TotAlPzExtAlPz", "0"),
    public tot_lav_int = new TextInput ("tot_lav_int", "0"),
    public tot_lav_int_charge = new TextInput ("tot_lav_int_charge", "0"),
    public tot_lav_ext = new TextInput ("tot_lav_ext", "0"),
    public charge_lav_int = new NumberInput("charge_lav_int", 0),
    public selectedShape : Shape = null,
    public shapeInputs: NumberInput[] = []){

      if (budget_date == null) {
        this.initDate();
      }
  }

  public setPdfSource(pdfSrc : string) {
    this.pdfSubject.next(pdfSrc)
  }

  //todo: classe per visualizzare nella stampa
  public mapToDb(works: Work[], services: ExternalWork[]) {
    const nPieces = this.n_pieces.value
    console.log(this.shapeInputs)
    return {
      uid: this.uid,
      client_name : this.client_name.value,
      client_code : this.client_code.value,
      pieces : this.n_pieces.value,
      date : this.budget_date.text,
      material_name : this.material.name,
      shape : this.selectedShape,
      shape_measures : this.shapeInputs.map(s => ({
        name: s.label, 
        value: s.value
      })),
      weigth : this.totWeigth.value,
      material_price_piece : this.pieceUnitaryPrice.value,
      material_price : this.tot_material_price.value,
      works: works,
      services: services,
      total_cost : this.recap_pc_pz.value,
      total_cost_piece : +this.recap_pc_pz.value / nPieces,
      client_price: this.recap_tot_prz.value,
      revenue : this.recap_tot.value,
      gain : this.recap_tot_gain.value
    }
  }

  private initDate() {

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();
      const dateS = dd + '/' +  mm + '/' + yyyy;
      this.budget_date = new TextInput("date", dateS)
  }
}