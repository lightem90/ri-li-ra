import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultipleValueInput } from '../../core/domain/common';

@Component({
  selector: 'app-multiple-value-input',
  templateUrl: './multiple-value-input.component.html',
  styleUrls: ['./multiple-value-input.component.css']
})
export class MultipleValueInputComponent implements OnInit {

  @Input() input: MultipleValueInput
  @Output("inputChanged") changed = new EventEmitter<string>()  

  availableTypes : string[] = []
  selT : string
  label : string

  ngOnInit() {
    this.label = this.input.label
    this.availableTypes = this.input.values
    this.selT = this.input.value
  }

  signalChanged(event) {
    this.input.value = this.selT
    this.changed.emit(this.selT)
    console.log(this.selT)
  }
}