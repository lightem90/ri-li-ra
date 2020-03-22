import { Component, ViewChild, ElementRef, } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  @ViewChild('sidenav') sidenav: MatSidenav;  

  constructor()
  {

  }

  toggleSideNavigator()
  {
    this.sidenav.toggle()
  }
}
