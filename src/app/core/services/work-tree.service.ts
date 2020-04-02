import { Injectable } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { TreeWorkNode, WorkType } from '../domain/works'
import { IWorkFactoryService } from './work-factory.service'

@Injectable()
export class WorkTreeService{

  dataChange = new BehaviorSubject<TreeWorkNode[]>([]);

  get data(): TreeWorkNode[] { return this.dataChange.value; }

  constructor(private _workFactory : IWorkFactoryService) { }

  addDefault(parent: TreeWorkNode) {
        if (parent.children) {
      parent.children.push(new TreeWorkNode()); //senza name, in modo che parta la gestione del nuovo stage
      this.dataChange.next(this.data);
    }
  }

  addWork(wType : string) {
    const workNode = this._workFactory.createWork(wType)
    this.data.push(workNode)
    this.dataChange.next(this.data)
  }

  //TODO: creare uno stage come TreeWorkNode, a seconda del tipo del parentNode (ogni lav ha stages differenti)
  updateWorkItem(node: TreeWorkNode, stageName: string, workName: string) {
    const stage = this._workFactory.createStageForWork(workName, stageName)
    node.name = stage.name;
    node.children = stage.children
    node.inputs = stage.inputs
    node.outputs = stage.outputs
    this.dataChange.next(this.data)
  }

}