import { NgModule } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from './environments/environment';

if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
}

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ], 
  exports: [    
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  declarations: []
})
export class FirebaseModule { }