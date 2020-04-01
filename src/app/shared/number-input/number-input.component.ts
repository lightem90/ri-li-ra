import { Component, OnInit, Input } from '@angular/core';

import {NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css']
})
export class NumberInputComponent implements OnInit {

  @Input() input : NumberInput

  constructor() { }

  ngOnInit() {
  }

}