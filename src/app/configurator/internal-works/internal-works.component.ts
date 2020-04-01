import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, TreeWorkNode, TreeWorkFlatNode} from '../../core/domain/works'
import {WorkTreeService} from '../../core/services/work-tree.service'

@Component({
  selector: 'app-internal-works',
  templateUrl: './internal-works.component.html',
  styleUrls: ['./internal-works.component.css']
})
export class InternalWorksComponent implements OnInit {

    //stati per il combo
    workTypes: WorkType[]
    selectedWorkType : WorkType = null

    //stati per l'albero (far diventare tutto un componente!)
    getLevel = (node: TreeWorkFlatNode) => node.level;
    isExpandable = (node: TreeWorkFlatNode) => node.expandable;
    getChildren = (node: TreeWorkNode): TreeWorkNode[] => node.children;
    hasChild = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.name === '';
    
    flatNodeMap = new Map<TreeWorkFlatNode, TreeWorkNode>();
    nestedNodeMap = new Map<TreeWorkNode, TreeWorkFlatNode>();    
    treeControl: FlatTreeControl<TreeWorkFlatNode>;
    treeFlattener: MatTreeFlattener<TreeWorkNode, TreeWorkFlatNode>;
    dataSource: MatTreeFlatDataSource<TreeWorkNode, TreeWorkFlatNode>;
    
    transformer = (node: TreeWorkNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.item === node.item
          ? existingNode
          : new TreeWorkFlatNode();
      flatNode.item = node.item;
      flatNode.level = level;
      flatNode.expandable = !!node.children;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
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

    /** Select the category so we can insert the new item. */
    addNewItem(node: TreeWorkFlatNode) {
      const parentNode = this.flatNodeMap.get(node);
      //this._database.insertItem(parentNode!, '');
      this.treeControl.expand(node);
    }

    /** Save the node to database */
    saveNode(node: TreeWorkFlatNode, itemValue: string) {
      const nestedNode = this.flatNodeMap.get(node);
      //TODO: creare stage
      //this._database.updateItem(nestedNode!, itemValue);
    }

    constructor(private _treeService: WorkTreeService) { 
      this.workTypes = Object.values(WorkType).filter(x => typeof x === 'string')
      this.selectedWorkType = this.workTypes[0]
      
      this.treeFlattener = new MatTreeFlattener(
        this.transformer, 
        this.getLevel,
        this.isExpandable, 
        this.getChildren);
      this.treeControl = new FlatTreeControl<TreeWorkFlatNode>(this.getLevel, this.isExpandable);

      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)
      _treeService.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
    }


    ngOnInit() {}

    addWork() {

    }

}