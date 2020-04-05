import {NumberInput, TextInput, DisabledInput} from "./common"
import {Material} from './material';

export class Budget {
  constructor(
    public uid: string = "",
    public customer: string = "",
    public customerDetail: string = "",
    public pieceCount: number = 1,
    public material: Material = null,
    public budget_date : DisabledInput = null,
    public n_pieces = new NumberInput ("n_pieces", 0),
    public client_name = new TextInput("client_name", ""))
  {
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