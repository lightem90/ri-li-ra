import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import {NumberInput, TreeWorkFlatNode, TreeWorkNode, IWorkTreeService, DisabledInput, MultipleValueInput} from '../../../core/domain/common'

@Component({
  selector: 'app-single-input-node',
  templateUrl: './single-input-node.component.html',
  styleUrls: ['./single-input-node.component.css']
})
export class SingleInputNodeComponent implements OnInit {

  @Output() recalcRequested: EventEmitter<TreeWorkNode> = new EventEmitter<TreeWorkNode>();
  @Input() node : TreeWorkNode

  input : DisabledInput = null

  ngOnInit() {
    if (this.node.inputs.length !== 1) {
      console.log("Error, cannot create input correctly")
    }

    this.input = this.node.inputs[0]
  }

  isMultiple() {
    return this.input instanceof MultipleValueInput;
  }

  recalc() {
    this.recalcRequested.emit(this.node)
  }

}