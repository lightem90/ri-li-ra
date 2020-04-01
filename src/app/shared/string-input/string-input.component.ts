import { Component, OnInit, Input } from '@angular/core';

import {TextInput} from '../../core/domain/common'

@Component({
  selector: 'app-string-input',
  templateUrl: './string-input.component.html',
  styleUrls: ['./string-input.component.css']
})
export class StringInputComponent implements OnInit {

  @Input() input : TextInput

  constructor() { }

  ngOnInit() {
  }

}