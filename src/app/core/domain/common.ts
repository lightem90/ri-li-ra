
import {BehaviorSubject} from 'rxjs';

export interface DisabledInput {
  label : string
  text : string
}

export class TextInput implements DisabledInput {
  
  public text : string

  constructor(
    public label: string, 
    public value: string) {
      
      this.text = value.toString()
  }
}

export class NumberInput implements DisabledInput{
  
  public text : string

  constructor(
    public label: string, 
    public value: number = 0) {
      this.text = value.toString()
  }
}

//Nodo che rappresenta un parametro della lavorazione (t. piazzamento etc..)
export class TreeWorkNode {

  constructor(public calculator: Function = null) {
   }

  recalculate() {
    console.log("recalc request for: " + this.name)
    console.log("Inputs: " +this.inputs + " text In: " + this.textInputs + " out: " +this.outputs)
    if (this.calculator){
      this.calculator(this.inputs, this.textInputs, this.outputs)
      console.log("recalc done")
    }
  }

  //inputs della lavorazione "padre" degli stage, servono per avere il prezzo disponibile
  public hiddenInputs : NumberInput []= []
  public name : string = ""
  public editable : boolean
  public inputs : NumberInput []= []
  public textInputs : TextInput[] = []
  public outputs : DisabledInput[]= []
  public children : TreeWorkNode[]= []
  public isSingleNode : boolean = false
  public canAddLevel : boolean = true
}
//nodo che rappresenta una lavorazione o uno stage "chiuso" nell'alber
export class TreeWorkFlatNode {
  
  constructor(public calculator: Function = null) { }

  public name : string = ""
  level: number = 0
  expandable: boolean
  public inputs : NumberInput[] = []
  public textInputs : TextInput[] = []
  public outputs : DisabledInput[] = []
  public isSingleNode : boolean = false
  public canAddLevelFlag : boolean = true
  public hiddenInputs : NumberInput []= []

  public canAddLevel() : boolean {
      return this.canAddLevelFlag && this.level === 0
  }
}


export interface IWorkTreeService {
  dataChange : BehaviorSubject<TreeWorkNode[]>
  addDefault(parent: TreeWorkNode)
  updateWorkItem(node: TreeWorkNode, stageName: string, workName: string)
}