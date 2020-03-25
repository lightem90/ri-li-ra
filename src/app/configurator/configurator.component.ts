import { Component, OnInit } from '@angular/core';

import {Budget} from '../core/domain/budget'

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  step = 0;
  budget : Budget
  
  ngOnInit() {
    //todo query db
    this.budget = new Budget()
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


}