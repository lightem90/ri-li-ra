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
        this.spec_weight_text = new NumberInput("spec_weight", this.spec_weight)
        return this;
    }
}