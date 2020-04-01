import { Component, OnInit, Input } from '@angular/core';

import {DisabledInput} from '../../core/domain/common'

@Component({
  selector: 'app-disabled-input',
  templateUrl: './disabled-input.component.html',
  styleUrls: ['./disabled-input.component.css']
})
export class DisabledInputComponent implements OnInit {

  @Input() input : DisabledInput

  constructor() { }

  ngOnInit() {
  }

}