import { 
  Component, 
  OnInit, 
  Input,
  Output, 
  EventEmitter } from '@angular/core';

import {TextInput} from '../../core/domain/common'

@Component({
  selector: 'app-string-input',
  templateUrl: './string-input.component.html',
  styleUrls: ['./string-input.component.css']
})
export class StringInputComponent implements OnInit {

  @Output("inputChanged") changed = new EventEmitter()
  @Input() input : TextInput

  constructor() { }

  ngOnInit() {
  }

  signalChanged() {
    this.changed.emit()
  }

}