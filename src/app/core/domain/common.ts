
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
  //"factory id", mi serve per capire come costruire l'albero della lavorazione
  public originalWorkName : string = ""
  public name : string = ""
  public editable : boolean
  public inputs : NumberInput []= []
  public outputs : DisabledInput[]= []
  public totTime : NumberInput = null
  public children : TreeWorkNode[]= []
  public isSingleNode : boolean = false
  public isStage : boolean = false
  public isWork : boolean = false
  public canAddLevel : boolean = false

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
  public outputs : DisabledInput[] = []
  public totPrice : DisabledInput = null
  public totTime : DisabledInput = null
  public isSingleNode : boolean = false
  public canAddLevelFlag : boolean = false
  public isWork : boolean = false
  public hourlyCost : NumberInput = null
}


export interface IWorkTreeService {
  dataChange : BehaviorSubject<TreeWorkNode[]>
  addDefault(parent: TreeWorkNode)
  updateWorkItem(node: TreeWorkNode, stageName: string, workName: string)
  deleteNode(node: TreeWorkNode, parentNode: TreeWorkNode)
}



export interface IWorkFactoryService 
{
  createWork(wTypeString : string) : TreeWorkNode
  createStageForWork(wTypeString : string, stageName: string) : TreeWorkNode
  fixChildrens(node : TreeWorkNode)
  restoreChildrens(node : TreeWorkNode)
  createDefaultChildrenNode() : TreeWorkNode
  //servirebbe un'interfaccia comune per Work e ExtWork
  createFromWork(work: any) : TreeWorkNode
}