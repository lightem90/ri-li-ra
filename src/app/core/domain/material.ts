import {NumberInput, TextInput, DisabledInput} from "./common"

//dominio per l'interfaccia..
export class Material
{
  constructor(
    public uid: string = "",
    public name: string = "",
    public price_p : number = 0,
    public price_t: number = 0,
    public spec_weight: number = 1,
    public img_url: string = "",
    public img_download_url: string = null,
    public spec_weight_text : DisabledInput = null)
    {
      this.spec_weight_text = new NumberInput("spec_weight", this.spec_weight)
    }

    public map(dbObj : any) {      
        this.uid = dbObj.uid, 
        this.name = dbObj.name, 
        this.price_p = dbObj.price_p, 
        this.price_t = dbObj.price_t, 
        this.spec_weight = dbObj.spec_weight, 
        this.img_url = dbObj.img_url
        this.img_download_url = dbObj.img_download_url
        this.spec_weight_text = new NumberInput("spec_weight", this.spec_weight)
        return this;
    }

    public map_to_db(){
      return {
        uid : this.uid, 
        name : this.name, 
        price_p : this.price_p, 
        price_t : this.price_t, 
        spec_weight : this.spec_weight, 
        img_url : this.img_url,
        img_download_url : this.img_download_url
      }

    }
}