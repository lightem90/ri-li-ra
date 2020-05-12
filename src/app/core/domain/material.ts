import {NumberInput, TextInput, DisabledInput} from "./common"
import {Shape} from "./piece"

//dominio per l'interfaccia..
export class Material
{
  constructor(
    public uid: string = "",
    public name: string = "",
    public spec_weight: number = 1,
    public img_url: string = "",
    public img_download_url: string = null,
    public spec_weight_text : DisabledInput = null,
    public prices_for_shape : {[key: string]: number} = null,
    public prices_for_shape_inputs : NumberInput[] = null) {
      
      this.prices_for_shape = {}
      this.prices_for_shape_inputs = []      
  
      this.spec_weight_text = new NumberInput("spec_weight", this.spec_weight)
    }

    //chiamata solo deserializzando i default (che hanno anche la vecchia implementazione)
    private initializeShapePrices() {
      
      Object.values(Shape)
        .filter(x => typeof x === 'string')
        .forEach(x => {
          this.prices_for_shape[x] = 0
        }) 
      this.initializeInputs()
    }

    //inizializza gli oggetti che finiranno in interfaccia
    private initializeInputs() {
      
      for(const name in this.prices_for_shape){
        this.prices_for_shape_inputs.push(
          new NumberInput(name + "PP", this.prices_for_shape[name]))
      }
    }

    //trasferisce i valori di input alla mappa di "dominio" che viene serializzata
    public writeUiValues(){

      for(const input of this.prices_for_shape_inputs){
        //toglie "PP" che mi servono per le traduzioni
        const purgedName = input.label.slice(0, -2)
        this.prices_for_shape[purgedName] = input.value
      }
    }

    public map(dbObj : any) {      
        this.uid = dbObj.uid, 
        this.name = dbObj.name, 
        this.spec_weight = dbObj.spec_weight, 
        this.img_url = dbObj.img_url
        this.img_download_url = dbObj.img_download_url
        this.spec_weight_text = new NumberInput("spec_weight", this.spec_weight)
        if (!dbObj.prices) {
          this.initializeShapePrices()
        } else {
          this.prices_for_shape = dbObj.prices
          this.initializeInputs()
        }
        return this;
    }

    public map_to_db(){
      return {
        uid : this.uid, 
        name : this.name, 
        spec_weight : this.spec_weight, 
        img_url : this.img_url,
        img_download_url : this.img_download_url,
        prices : this.prices_for_shape
      }

    }
}