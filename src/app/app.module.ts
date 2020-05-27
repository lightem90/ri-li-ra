import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FirebaseModule } from './firebase.module';

import { environment } from './environments/environment';

import { AppComponent } from './app.component';

import {FirebaseHelper} from './core/services/firebase-helper'
import {ConfiguratorService} from './core/services/configurator.service'
import {WorkFactoryService} from './core/services/work-factory.service'
import {ExternalWorkFactoryService} from './core/services/externalwork-factory.service'
import {WorkTreeService} from './core/services/work-tree.service'
import {AccountService} from './core/services/account.service'
import {AccountManagerService} from './core/services/account-manager.service'

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LoginComponent } from './static/login/login.component';
import { RegisterComponent } from './static/register/register.component'
import { NotFoundComponent } from './static/not-found/not-found.component';
import { AboutComponent } from './static/about/about.component';
import { FaqComponent } from './static/faq/faq.component';
import { ContactsComponent } from './static/contacts/contacts.component';
import { HeaderComponent } from './header/header.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { MaterialPickerComponent } from './configurator/material-picker/material-picker.component';
import { PieceSelectorComponent } from './configurator/piece-selector/piece-selector.component';
import { PiecePriceComponent } from './configurator/piece-price/piece-price.component';
import { InternalWorksComponent } from './configurator/internal-works/internal-works.component';
import { ExternalWorksComponent } from './configurator/external-works/external-works.component';
import { RecapComponent } from './configurator/recap/recap.component';
import { HomeConfiguratorComponent } from './home-configurator/home-configurator.component';
import { NumberInputComponent } from './shared/number-input/number-input.component';
import { StringInputComponent } from './shared/string-input/string-input.component';
import { DisabledInputComponent } from './shared/disabled-input/disabled-input.component';
import { PdfUploaderComponent } from './shared/pdf-uploader/pdf-uploader.component';
import { WorkTreeComponent } from './shared/work-tree/work-tree.component';
import { SingleInputNodeComponent } from './shared/work-tree/single-input-node/single-input-node.component';
import { MaterialListComponent } from './shared/material-list/material-list.component';
import { InlineEditComponent } from './shared/inline-edit/inline-edit.component';
import { UserLandingComponent } from './user-landing/user-landing.component';


export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports:      [ 
    AppRoutingModule,
    MaterialModule,
    FirebaseModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true}),
    CommonModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,
    BrowserModule, 
    FormsModule, 
    ReactiveFormsModule],
  declarations: [ 
    AppComponent, 
    LoginComponent, 
    RegisterComponent, 
    NotFoundComponent, 
    AboutComponent, 
    FaqComponent, 
    ContactsComponent, 
    HeaderComponent, 
    ConfiguratorComponent,
    HomeConfiguratorComponent,
    MaterialPickerComponent,
    PieceSelectorComponent,
    PiecePriceComponent,
    NumberInputComponent,
    StringInputComponent,
    DisabledInputComponent,
    PdfUploaderComponent,
    InternalWorksComponent,
    ExternalWorksComponent,
    RecapComponent,
    WorkTreeComponent,
    UserLandingComponent,
    SingleInputNodeComponent,
    MaterialListComponent,
    InlineEditComponent],
  bootstrap:    [ AppComponent ],
  providers: [
    FirebaseHelper, 
    ConfiguratorService, 
    WorkFactoryService, 
    ExternalWorkFactoryService, 
    AccountService, 
    AccountManagerService]
})
export class AppModule { }
