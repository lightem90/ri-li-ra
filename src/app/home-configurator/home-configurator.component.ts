import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {ConfiguratorService} from '../core/services/configurator.service'

@Component({
  selector: 'app-home-configurator',
  templateUrl: './home-configurator.component.html',
  styleUrls: ['./home-configurator.component.css']
})
export class HomeConfiguratorComponent implements OnInit {

  background : any
  constructor(
    private router: Router,
    private configuratorService : ConfiguratorService)
  {
    this.configuratorService.getAssetUrl('assets/home_background.jpg')
      .subscribe(res => {
        if (res)
        {
          this.background = res
          console.log(this.background)
        }
    })

  }

  ngOnInit() {
  }

  startConfigurator()
  {
    this.configuratorService.startNewSession();
    this.router.navigate(['configurator']);
  }

}