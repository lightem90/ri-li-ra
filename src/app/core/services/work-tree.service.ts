import { Injectable } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { WorkType } from '../domain/works'
import { TreeWorkNode } from '../domain/common'
import { IWorkFactoryService } from './work-factory.service'

@Injectable()
export class WorkTreeService{

  dataChange = new BehaviorSubject<TreeWorkNode[]>([]);

  get data(): TreeWorkNode[] { return this.dataChange.value; }

  constructor(private _workFactory : IWorkFactoryService) { }

  addDefault(parent: TreeWorkNode) {
    if (parent.children) {
      const t = new TreeWorkNode()
      parent.children.push(t); //senza name, in modo che parta la gestione del nuovo stage
      this.dataChange.next(this.data);
    }
  }

  addNode(workNode : TreeWorkNode) {
    this.data.push(workNode)
    this.dataChange.next(this.data)
  }

  addWork(wType : string) {
    const workNode = this._workFactory.createWork(wType)
    this.data.push(workNode)
    this.dataChange.next(this.data)
  }

  updateWorkItem(node: TreeWorkNode, parentNode: TreeWorkNode, stageName: string, workName: string) {
    const stage = this._workFactory.createStageForWork(workName, stageName)
    node.name = stage.name;
    node.children = stage.children
    node.inputs = stage.inputs
    node.textInputs = stage.textInputs
    node.outputs = stage.outputs
    node.calculator = stage.calculator
    
    if (parentNode)
    {
      console.log(parentNode)
      node.hourlyCost = parentNode.hourlyCost
    }

    this.dataChange.next(this.data)
  }

  deleteNode(node: TreeWorkNode, parentNode: TreeWorkNode) {
    if (parentNode) {
      //se sono uno "stage"
      const index = parentNode.children.indexOf(node);
      if (index !== -1) {
        parentNode.children.splice(index, 1);
        this.dataChange.next(this.data);
        return true
      }
      return false
    } else {
      //se sono una lavorazione
      const index = this.data.indexOf(node)
      if (index !== -1) {
        this.data.splice(index, 1);
        this.dataChange.next(this.data);
        return true
      }
      return false
    }

    return false
  }

}