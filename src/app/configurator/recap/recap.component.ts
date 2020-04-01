import { Component, OnInit } from '@angular/core';

import {TextInput, NumberInput} from '../../core/domain/common'

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.css']
})
export class RecapComponent implements OnInit {

  tot_prz = new NumberInput ("PrezzoAlPz", 0)
  tot = new TextInput("TotConf", "NonCalc")
  tot_gain = new TextInput("TotGain", "NonCalc")
  pc_pz = new TextInput("PrezzoCostoAlPz", "NonCalc")
  pce_pz = new TextInput("TotAlPzExtAlPz", "NonCalc")

  constructor() {

  }

  ngOnInit() {}

}