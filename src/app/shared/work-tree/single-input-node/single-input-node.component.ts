import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import {NumberInput, TreeWorkFlatNode, TreeWorkNode, IWorkTreeService} from '../../../core/domain/common'

@Component({
  selector: 'app-single-input-node',
  templateUrl: './single-input-node.component.html',
  styleUrls: ['./single-input-node.component.css']
})
export class SingleInputNodeComponent{

  @Output() recalcRequested: EventEmitter<TreeWorkNode> = new EventEmitter<TreeWorkNode>();
  @Input() node : TreeWorkNode

  recalc() {
    this.recalcRequested.emit(this.node)
  }

}