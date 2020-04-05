import { Component, OnInit, Input } from '@angular/core';

import {TextInput, NumberInput} from '../../core/domain/common'
import {Budget} from '../../core/domain/budget'

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.css']
})
export class RecapComponent implements OnInit {

  @Input() budget : Budget

  tot_prz : NumberInput
  tot : TextInput
  tot_gain : TextInput
  pc_pz : TextInput
  pce_pz : TextInput

  constructor() {

  }

  ngOnInit() {
    this.tot_prz = this.budget.recap_tot_prz
    this.tot = this.budget.recap_tot
    this.tot_gain = this.budget.recap_tot_gain
    this.pc_pz = this.budget.recap_pc_pz
    this.pce_pz = this.budget.recap_pce_pz
  }

}