import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {ConfiguratorService} from '../core/services/configurator.service'
import {AccountManagerService} from '../core/services/account-manager.service'


@Component({
  selector: 'app-home-configurator',
  templateUrl: './home-configurator.component.html',
  styleUrls: ['./home-configurator.component.css']
})
export class HomeConfiguratorComponent implements OnInit {

  background : any
  constructor(
    private router: Router,
    private _configuratorService : ConfiguratorService,
    private _accountManager : AccountManagerService) {

    this._accountManager.getAssetUrl('assets/home_background.jpg')
      .subscribe(res => {
        if (res)
        {
          this.background = res
        }
    })

  }

  ngOnInit() {
  }

  startConfigurator() {
    this._configuratorService.startNewSession();
    this.router.navigate(['configurator']);
  }

  styleBackground() {
    return {
      'background-image' : 'url(' + this.background + ')'
    }
  }

}