import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-col-data',
  templateUrl: './col-data.component.html',
  styleUrls: ['./col-data.component.css']
})
export class ColDataComponent implements OnInit {

  @Input() headers: string[] 
  @Input() valueData : {name: string, value: string}

  constructor() { }

  ngOnInit() {
  }

}