import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.css']
})
export class RecapComponent implements OnInit {

  tot_pz = {label: "PrezzoAlPz", value: 0}
  tot = {label: "TotConf", text: "NonCalc"}
  tot_gain = {label: "TotGain", text: "NonCalc"}
  pc_pz = {label: "PrezzoCostoAlPz", text: "NonCalc"}
  pce_pz = {label: "TotAlPzExtAlPz", text: "NonCalc"}

  constructor() {

  }

  ngOnInit() {}

}