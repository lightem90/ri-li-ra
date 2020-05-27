import { Component, OnInit, ViewChild } from '@angular/core';

import {Budget} from '../core/domain/budget'
import { ConfiguratorService } from '../core/services/configurator.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  step = 0;
  budget : Budget

  constructor(
    private toastr: ToastrService,
    private _configurator: ConfiguratorService) { }
  
  ngOnInit() {    
    this.toastr.overlayContainer = this.toastContainer;
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