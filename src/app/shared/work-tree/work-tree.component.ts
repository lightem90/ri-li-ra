import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {WorkType, TreeWorkNode, TreeWorkFlatNode} from '../../core/domain/works'
import {WorkTreeService} from '../../core/services/work-tree.service'

import {NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-work-tree',
  templateUrl: './work-tree.component.html',
  styleUrls: ['./work-tree.component.css']
})
export class WorkTreeComponent implements OnInit {
  
    //stati per l'albero (far diventare tutto un componente!)
    getLevel = (node: TreeWorkFlatNode) => node.level;
    isExpandable = (node: TreeWorkFlatNode) => node.expandable;
    getChildren = (node: TreeWorkNode): TreeWorkNode[] => node.children;
    hasChild = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.name === '';
    hasOneInput = (_: number, _nodeData: TreeWorkFlatNode) => _nodeData.inputs.length === 1;
    
    flatNodeMap = new Map<TreeWorkFlatNode, TreeWorkNode>();
    nestedNodeMap = new Map<TreeWorkNode, TreeWorkFlatNode>();    
    treeControl: FlatTreeControl<TreeWorkFlatNode>;
    treeFlattener: MatTreeFlattener<TreeWorkNode, TreeWorkFlatNode>;
    dataSource: MatTreeFlatDataSource<TreeWorkNode, TreeWorkFlatNode>;
    
    transformer = (node: TreeWorkNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.name === node.name
          ? existingNode
          : new TreeWorkFlatNode();
      flatNode.name = node.name;
      flatNode.level = level;
      flatNode.expandable = !!node.children;
      flatNode.inputs = node.inputs
      flatNode.outputs = node.outputs
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    }

    constructor(private _treeService: WorkTreeService) { 
      
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

  ngOnInit() {
  } 

    /** Select the category so we can insert the new item. */
    addNewItem(node: TreeWorkFlatNode) {
      const parentNode = this.flatNodeMap.get(node);
      this._treeService.addDefault(parentNode)
      this.treeControl.expand(node);
    }

    createStage(node: TreeWorkFlatNode, stageName: string) {
      const parentNode = this.getParentNode(node) 
      const nestedNode = this.flatNodeMap.get(node);
      this._treeService.updateItem(nestedNode!, stageName, parentNode.name);
      this.treeControl.expand(node);
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

}