import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { MatSliderModule } from '@angular/material/slider';
import { environment } from './environments/environment';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import {FirebaseHelper} from './core/services/firebase-helper'

import * as firebase from 'firebase/app';
import { LoginComponent } from './static/login/login.component';
import { RegisterComponent } from './static/register/register.component';
import { NotFoundComponent } from './static/not-found/not-found.component';
import { AboutComponent } from './static/about/about.component';
import { FaqComponent } from './static/faq/faq.component';
import { ContactsComponent } from './static/contacts/contacts.component';
import { HeaderComponent } from './header/header.component';
import { ConfiguratorComponent } from './configurator/configurator.component';

if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
}

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    MatSliderModule,   
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AppRoutingModule    ],
  declarations: [ 
    AppComponent, 
    HelloComponent, 
    LoginComponent, 
    RegisterComponent, 
    NotFoundComponent, 
    AboutComponent, 
    FaqComponent, 
    ContactsComponent, 
    HeaderComponent, 
    ConfiguratorComponent ],
  bootstrap:    [ AppComponent ],
  providers: [FirebaseHelper]
})
export class AppModule { }
