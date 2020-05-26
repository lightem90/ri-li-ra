import { Component, ViewChild, ElementRef, OnInit, } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';

import { TranslateService } from '@ngx-translate/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;  
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
 
  constructor(
    private translateService: TranslateService,
    private toastrService: ToastrService) {
    translateService.addLangs(['it']);
    translateService.setDefaultLang('it');
  }
  
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }

  toggleSideNavigator() {
    this.sidenav.toggle()
  }
}
