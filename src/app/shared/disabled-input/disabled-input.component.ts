import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DisabledInput } from '../../core/domain/common'


@Component({
  selector: 'app-disabled-input',
  templateUrl: './disabled-input.component.html',
  styleUrls: ['./disabled-input.component.css']
})
export class DisabledInputComponent {

  @Output("inputChanged") changed = new EventEmitter<string>()
  @Input() input : DisabledInput
}