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
export class NumberInputComponent {

  @Output("inputChanged") changed = new EventEmitter<number>()
  @Input() input : NumberInput

  signalChanged(event) {
    this.changed.emit(this.input.value)
  }

}