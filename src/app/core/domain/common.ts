
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

  constructor(private _calculator: Function = null) {
    
  }

  recalculate() {
    if (this._calculator){
      this._calculator.call([this.inputs, this.textInputs, this.outputs])
    }
  }

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
  
  public name : string = ""
  level: number = 0
  expandable: boolean
  public inputs : NumberInput[] = []
  public textInputs : TextInput[] = []
  public outputs : DisabledInput[] = []
  public isSingleNode : boolean = false
  public canAddLevelFlag : boolean = true

  public canAddLevel() : boolean {
      return this.canAddLevelFlag && this.level === 0
  }
}


export interface IWorkTreeService {
  dataChange : BehaviorSubject<TreeWorkNode[]>
  addDefault(parent: TreeWorkNode)
  updateWorkItem(node: TreeWorkNode, stageName: string, workName: string)
}