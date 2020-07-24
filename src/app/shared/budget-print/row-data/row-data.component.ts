import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-row-data',
  templateUrl: './row-data.component.html',
  styleUrls: ['./row-data.component.css']
})
export class RowDataComponent implements OnInit {

  @Input() headers: string[] 
  @Input() valueData : {name: string, value: string}

  constructor() { }

  ngOnInit() {
  }

}