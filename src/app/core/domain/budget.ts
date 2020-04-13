import {NumberInput, TextInput, DisabledInput} from "./common"
import {Material} from './material';
import {Shape} from './piece';

//dominio per l'interfaccia..
export class Budget {
  constructor(
    public uid: string = "",
    public customer: string = "",
    public customerDetail: string = "",
    public pieceCount: number = 1,
    public material: Material = null,
    public budget_date : DisabledInput = null,
    public n_pieces = new NumberInput ("n_pieces", 0),
    public client_name = new TextInput("client_name", ""),
    public pieceChargePercentage = new NumberInput("PercRic", 0),
    public totWeigthPerPiece = new TextInput("PesoTotPerPz", "0"),
    public totWeigth = new TextInput("PesoTot", "0"),
    public pieceUnitaryPrice = new TextInput("CostoAlPz", "0"),    
    public recap_tot_prz = new NumberInput ("PrezzoAlPz", 0),
    public recap_tot_gain_perc = new NumberInput ("TotGainPerc", 0),
    public recap_tot = new TextInput("TotConf", "NonCalc"),
    public recap_tot_gain = new TextInput("TotGain", "NonCalc"),
    public recap_pc_pz = new TextInput("PrezzoCostoAlPz", "NonCalc"),
    public recap_pce_pz = new TextInput("TotAlPzExtAlPz", "NonCalc"),
    public selectedShape : Shape = null,
    public shapeInputs: NumberInput[] = []){
      
      if (budget_date == null) {
        this.initDate();
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