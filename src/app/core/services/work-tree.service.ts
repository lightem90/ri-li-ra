import { Injectable } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

import { TreeWorkNode } from '../domain/works'
import { WorkFactoryService } from './work-factor.service'

@Injectable()
export class WorkTreeService {

  dataChange = new BehaviorSubject<TreeWorkNode[]>([]);

  get data(): TreeWorkNode[] { return this.dataChange.value; }

  constructor(private _workFactory : WorkFactoryService) { }

  insertItem(parent: TreeWorkNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TreeWorkNode);
      this.dataChange.next(this.data);
    }
  }

}