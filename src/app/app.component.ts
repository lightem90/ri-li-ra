import { Component, ViewChild, ElementRef, } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  @ViewChild('sidenav') sidenav: MatSidenav;  

  constructor(private translateService: TranslateService) {
    translateService.addLangs(['it']);
    translateService.setDefaultLang('it');
  }

  toggleSideNavigator()
  {
    this.sidenav.toggle()
  }
}
