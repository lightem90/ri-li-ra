import {NumberInput, TextInput, DisabledInput, TreeWorkNode} from "./common"

export enum WorkType {
  Taglio,
  Sbavatura,
  Fresatura,
  Tornitura,
  RettificaVerticale,
  RettificaTangenziale,
  Stozzatura,
  Dentatura,
  Sabbiatura,
  Saldatura,
  IncisioneLaser,
  ControlloQualita
}

//lavorazione salvata su db
export class Work {


  //inizializza un TreeWorkNode con i dati della lavorazione
  mapTo(node: TreeWorkNode) {



    return this
  }

  //inizializza la lavorazione dal TreeWorkNode
  mapFrom(node: TreeWorkNode) {
    
  }
}
