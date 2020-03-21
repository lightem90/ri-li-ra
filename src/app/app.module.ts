import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatSliderModule } from '@angular/material/slider';
import { environment } from './environments/environment';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import {FirebaseHelper} from './core/services/firebase-helper'

import * as firebase from 'firebase/app';

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
    AngularFireDatabaseModule    ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers: [FirebaseHelper]
})
export class AppModule { }
