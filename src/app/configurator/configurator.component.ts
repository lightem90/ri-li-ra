import { Component, OnInit } from '@angular/core';

import {Budget} from '../core/domain/budget'
import { ConfiguratorService } from '../core/services/configurator.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  step = 0;
  budget : Budget

  constructor(private _configurator: ConfiguratorService) {    

  }
  
  ngOnInit() {
    this._configurator.startNewSession()
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  print() {
    this._configurator.print()
  }

  save() {
    this._configurator.save()
  }


}