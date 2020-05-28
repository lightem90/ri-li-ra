import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, Work} from '../../core/domain/work'

import {WorkTreeService} from '../../core/services/work-tree.service'

import {NumberInput, TreeWorkFlatNode, TreeWorkNode, IWorkTreeService, IWorkFactoryService} from '../../core/domain/common'

@Component({
  selector: 'app-work-tree',
  templateUrl: './work-tree.component.html',
  styleUrls: ['./work-tree.component.css']
})
export class WorkTreeComponent implements OnInit {  

    @Input() editAndSave : boolean = false
    @Input() workTypes: string[] = []
    @Input() userWorks: any[] = []
    @Input() workFactoryService: IWorkFactoryService
    @Output() recalculated = new EventEmitter<number>();
    @Output() saveRequest = new EventEmitter<TreeWorkNode>();
    @Output() deleteRequest = new EventEmitter<TreeWorkNode>();
    @Output() dataChanged = new EventEmitter<TreeWorkNode[]>();
    

    selectedWorkType : string = null
    _treeService : WorkTreeService

    //stati per l'albero (far diventare tutto un componente!)
    getLevel = (node: TreeWorkFlatNode) => node.level;
    isExpandable = (node: TreeWorkFlatNode) => node.expandable;
    getChildren = (node: TreeWorkNode): TreeWorkNode[] => node.children;
    hasChild = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.name === ''
    hasOneInput = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.isSingleNode
    
    flatNodeMap = new Map<TreeWorkFlatNode, TreeWorkNode>();
    nestedNodeMap = new Map<TreeWorkNode, TreeWorkFlatNode>();    
    treeControl: FlatTreeControl<TreeWorkFlatNode>;
    treeFlattener: MatTreeFlattener<TreeWorkNode, TreeWorkFlatNode>;
    dataSource: MatTreeFlatDataSource<TreeWorkNode, TreeWorkFlatNode>;
    
    transformer = (node: TreeWorkNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.name === node.name
          ? existingNode
          : new TreeWorkFlatNode(node.calculator);
      flatNode.name = node.name;
      flatNode.level = level;
      flatNode.expandable = !!node.children;
      flatNode.inputs = node.inputs
      flatNode.outputs = node.outputs
      flatNode.isSingleNode = node.isSingleNode
      flatNode.canAddLevelFlag = node.canAddLevel
      flatNode.isWork = node.isWork
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    }

    constructor() { 
      
      this.treeFlattener = new MatTreeFlattener(
        this.transformer, 
        this.getLevel,
        this.isExpandable, 
        this.getChildren);
      this.treeControl = new FlatTreeControl<TreeWorkFlatNode>(this.getLevel, this.isExpandable);

      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)
    }

    ngOnInit() {

      this._treeService = new WorkTreeService(this.workFactoryService)
      this._treeService.dataChange.subscribe(data => {
        this.dataSource.data = data;
        this.dataChanged.emit(data)
      });

      //li aggiungo come nodi all'albero solo se li posso salvare (nella landing utente)
      if (this.editAndSave) {
        
        for(let i = 0; i<this.userWorks.length; i++) {
          const work = this.userWorks[i]
          const node = this.workFactoryService.createFromWork(work)
          if (node){
            this._treeService.addNode(node)
          }
        }
      } else {
        //nel configuratore invece li aggiungo come possibilità del combobox
        
        for(let i = 0; i<this.userWorks.length; i++) { 
          this.workTypes.push(this.userWorks[i].name)
        }
      }

      this.selectedWorkType  = this.workTypes[0]
    }

    getNodeFromFlat(node : TreeWorkFlatNode){
      return this.flatNodeMap.get(node);
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node : TreeWorkFlatNode) {
      const parentNode = this.flatNodeMap.get(node);
      this._treeService.addDefault(parentNode)
      this.treeControl.expand(node);
    }

    //i singoli input richiamano recalculate che triggera il ricalcolo fino alla lavorazione (caso peggiore)
    recalcNode(node : TreeWorkNode) {
      const flatNode = this.nestedNodeMap.get(node)
      const parentNode = this.getParentNode(flatNode)
      const parentRealNode = this.flatNodeMap.get(parentNode)
      parentRealNode.recalculate()
      const work = this.getParentNode(parentNode)
      if (work !== null) {
        const workNode = this.flatNodeMap.get(work)
        workNode.recalculate()
      }

      this._recalcTree()
    }

    _recalcTree(){

      //calcola il totale come somma dei vari totali
      var totWorks = this.dataSource.data
        //.filter(n => n.isWork) non è necessario, gli elementi di 1 livello sono sempre lavorazioni
        .reduce((sum, n) => sum + (+n.outputs[0].text), 0)

      this.recalculated.emit(totWorks)
    }

    createStage(node: TreeWorkFlatNode, stageName: string) {
      const parentNode = this.getParentNode(node) 
      const parentNodeFlat = this.flatNodeMap.get(parentNode)
      const nestedNode = this.flatNodeMap.get(node);
      this._treeService.updateWorkItem(nestedNode!, parentNodeFlat, stageName, parentNode.name);
      this._recalcTree()
      this.treeControl.expand(node);
    }

    saveNode(node : TreeWorkFlatNode) {      
      const workNode = this.flatNodeMap.get(node)
      if (workNode) {
        this.saveRequest.emit(workNode)
      }
    }
    
  getParentNode(node: TreeWorkFlatNode): TreeWorkFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  deleteNode(nodeFlat: TreeWorkFlatNode) {
    const node = this.flatNodeMap.get(nodeFlat)
    const parentFlatNode = this.getParentNode(nodeFlat)
    const parentNode = this.flatNodeMap.get(parentFlatNode)
    if (this._treeService.deleteNode(node, parentNode)) {
      this.flatNodeMap.delete(nodeFlat)
      this.nestedNodeMap.delete(node)
      //evento per la cancellazione dal db (dove serve)
      this.deleteRequest.emit(node)
    }
    this._recalcTree()
  }

  addWork() {
    const selWork = this.selectedWorkType.toString()
    const uWork = this.userWorks.find(w => w.name === selWork)
    //se è una lavorazione custom creo il nodo dal relativo metodo
    const u = uWork as Work    
    if (u) {  
      const node = this.workFactoryService.createFromWork(u)
      if (node){
        //crea il nodo dalla lavorazione dell'utente già definita
        this._treeService.addNode(node)
        return
      } else {
        console.log("Impossibile creare la lavorazione: " + selWork)
      }
    }
    
    //crea la lavorazione standard
    this._treeService.addWork(selWork)

    this._recalcTree()
  }

  canSaveNode(nodeFlat: TreeWorkFlatNode){   
    const node = this.flatNodeMap.get(nodeFlat) 
    const result = this.showInlineEdit(nodeFlat)
      && !this.workTypes.some(w => w === node.name)
    return result
  }

  showInlineEdit(nodeFlat: TreeWorkFlatNode){    
    return this.editAndSave 
      && nodeFlat.isWork 
  }


}