import {Material} from './material';

export class Budget {
  constructor(
    public uid: string = "",
    public customer: string = "",
    public customerDetail: string = "",
    public pieceCount: number = 1,
    public material: Material = null,
    public date : string = null)
  {
      if (date == null) {
        this.initDate();
      }
  }


  private initDate() {

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      this.date = mm + '/' + dd + '/' + yyyy;
  }
}