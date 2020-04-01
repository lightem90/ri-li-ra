import { Injectable } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { TreeWorkNode, WorkType } from '../domain/works'
import { WorkFactoryService } from './work-factory.service'

@Injectable()
export class WorkTreeService {

  dataChange = new BehaviorSubject<TreeWorkNode[]>([]);

  get data(): TreeWorkNode[] { return this.dataChange.value; }

  constructor(private _workFactory : WorkFactoryService) { }

  insertItem(parent: TreeWorkNode, name: string) {
    if (parent.stages) {
      parent.stages.push({item: name} as TreeWorkNode);
      this.dataChange.next(this.data);
    }
  }

  addWork(wTypeToAdd : WorkType) {
    this.data.push(this._workFactory.createWork(wTypeToAdd))
    this.dataChange.next(this.data);
  }

}