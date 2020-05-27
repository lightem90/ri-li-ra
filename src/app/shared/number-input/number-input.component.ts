import { 
  Component, 
  OnInit, 
  Input,
  Output, 
  EventEmitter  } from '@angular/core';

import {NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css']
})
export class NumberInputComponent implements OnInit {

  @Output("inputChanged") changed = new EventEmitter<number>()
  @Input() input : NumberInput

  constructor() { }

  ngOnInit() {
  }

  signalChanged(event) {
    this.changed.emit(this.input.value)
  }

}