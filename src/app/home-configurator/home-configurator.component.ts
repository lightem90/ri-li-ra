import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-configurator',
  templateUrl: './home-configurator.component.html',
  styleUrls: ['./home-configurator.component.css']
})
export class HomeConfiguratorComponent implements OnInit {

  constructor(private router: Router)
  {

  }

  ngOnInit() {
  }

  startConfigurator()
  {
    this.router.navigate(['configurator']);
  }

}