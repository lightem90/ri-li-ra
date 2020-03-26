import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-disabled-input',
  templateUrl: './disabled-input.component.html',
  styleUrls: ['./disabled-input.component.css']
})
export class DisabledInputComponent implements OnInit {

  @Input() input : {label: string, text: string}

  constructor() { }

  ngOnInit() {
  }

}