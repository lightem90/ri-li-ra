
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
    if (this.calculator){
      this.calculator(this)
    }
  }

  //inputs della lavorazione "padre" degli stage, servono per avere il prezzo disponibile
  public hourlyCost : NumberInput = null
  public name : string = ""
  public editable : boolean
  public inputs : NumberInput []= []
  public textInputs : TextInput[] = []
  public outputs : DisabledInput[]= []
  public totTime : NumberInput = new NumberInput("wMinutes", 0)
  public totTimeReadOnly : DisabledInput = new TextInput('wMinutes', "0")
  public children : TreeWorkNode[]= []
  public isSingleNode : boolean = false
  public isStage : boolean = false
  public isWork : boolean = false
  public canAddLevel : boolean = true

  //l'input del tempo di lavorazione è visualizzabile solo se non ci sono stage
  workTimeEnabled() {
    return !this.children.some(c => c.isStage && c.name !== "")
  }
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
  public totPrice : DisabledInput = null
  public totTime : DisabledInput = null
  public isSingleNode : boolean = false
  public canAddLevelFlag : boolean = true
  public hourlyCost : NumberInput = null
}


export interface IWorkTreeService {
  dataChange : BehaviorSubject<TreeWorkNode[]>
  addDefault(parent: TreeWorkNode)
  updateWorkItem(node: TreeWorkNode, stageName: string, workName: string)
  deleteNode(node: TreeWorkNode, parentNode: TreeWorkNode)
}