import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType} from '../../core/domain/work'

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

      this.selectedWorkType  = this.workTypes[0]
      this._treeService = new WorkTreeService(this.workFactoryService)
      this._treeService.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });

      for(let i = 0; i<this.userWorks.length; i++) {
        const node = this.workFactoryService.createFromWork(this.userWorks[i])
        if (node){
          this._treeService.addNode(node)
        }

      }
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node : TreeWorkFlatNode) {
      const parentNode = this.flatNodeMap.get(node);
      this._treeService.addDefault(parentNode)
      this.treeControl.expand(node);
    }

    //i singoli input richiamano recalculate che triggera il ricalcolo fino alla lavorazione (caso peggiore)
    recalcNode(node : TreeWorkFlatNode) {
      const parentNode = this.getParentNode(node)
      const parentRealNode = this.flatNodeMap.get(parentNode)
      parentRealNode.recalculate()
      const work = this.getParentNode(parentNode)
      if (work !== null) {
        const workNode = this.flatNodeMap.get(work)
        workNode.recalculate()
      }

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
    }
  }

  addWork() {
    this._treeService.addWork(this.selectedWorkType.toString())
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