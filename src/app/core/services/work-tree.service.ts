import { Injectable } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { WorkType, Work } from '../domain/work'
import { TreeWorkNode, IWorkFactoryService } from '../domain/common'

@Injectable()
export class WorkTreeService{

  dataChange = new BehaviorSubject<TreeWorkNode[]>([]);

  public get data(): TreeWorkNode[] { return this.dataChange.value; }

  constructor(private _workFactory : IWorkFactoryService) { }

  addDefault(parent: TreeWorkNode) {
    if (parent.children) {
      const t = this._workFactory.createDefaultChildrenNode()
      if (t) {
        parent.children.push(t); 
        this.dataChange.next(this.data);
        return t
      }      
    }
  }

  addNode(workNode : TreeWorkNode) {
    this.data.push(workNode)
    this.dataChange.next(this.data)
    return workNode
  }

  addWork(wType : string) {
    const workNode = this._workFactory.createWork(wType)    
    this._workFactory.fixChildrens(workNode)
    this.data.push(workNode)
    this.dataChange.next(this.data)
    return workNode
  }

  updateWorkItem(node: TreeWorkNode, parentNode: TreeWorkNode, stageName: string, workName: string) {

    if (stageName !== "")
    {
      let initialStagesPresent = parentNode.children.some(c => c.isStage && c.name !== "");

      const stage = this._workFactory.createStageForWork(workName, stageName)
      node.name = stage.name;
      node.children = stage.children
      node.inputs = stage.inputs
      node.outputs = stage.outputs
      node.calculator = stage.calculator
      
      if (parentNode){
        node.hourlyCost = parentNode.hourlyCost
        //devo far apparire i valori dei vari tempi e rimuovere il tempo "totale", se necesario. Se c'erano già degli stages non devo cambiare nulla, i tempi sono giò visibili
        if (!initialStagesPresent) {
          this._workFactory.restoreChildrens(parentNode)
        }
      }
      this.dataChange.next(this.data)
      return stage
    }    
  }

  deleteNode(node: TreeWorkNode, parentNode: TreeWorkNode) {
    let changed = false
    if (parentNode) {
      //se sono uno "stage"
      const index = parentNode.children.indexOf(node)
      if (index !== -1) {
        parentNode.children.splice(index, 1)
        this._workFactory.fixChildrens(parentNode)
        parentNode.recalculate()
        this.dataChange.next(this.data)
        changed = true
      }
      
    } else {
      //se sono una lavorazione
      const index = this.data.indexOf(node)
      if (index !== -1) {
        this.data.splice(index, 1);        
        this.dataChange.next(this.data);
        changed = true
      }
    }

    return changed
  }

}