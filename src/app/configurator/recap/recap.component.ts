import { Component, OnInit, Input } from '@angular/core';

import {TextInput, NumberInput} from '../../core/domain/common'
import { ConfiguratorService } from '../../core/services/configurator.service'

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.css']
})
export class RecapComponent implements OnInit {

  tot_prz : NumberInput
  tot_gain_perc : NumberInput
  tot : TextInput
  tot_gain : TextInput
  pc_pz : TextInput
  pce_pz : TextInput

  constructor(private _configuratorService : ConfiguratorService) {

  }

  ngOnInit() {
    this.tot_prz = this._configuratorService.currentSession.recap_tot_prz
    this.tot_gain_perc = this._configuratorService.currentSession.recap_tot_gain_perc
    this.tot = this._configuratorService.currentSession.recap_tot
    this.tot_gain = this._configuratorService.currentSession.recap_tot_gain
    this.pc_pz = this._configuratorService.currentSession.recap_pc_pz
    this.pce_pz = this._configuratorService.currentSession.recap_pce_pz
  }

  forceGain() {
    this._configuratorService.updateBudgetResult()
  }

}