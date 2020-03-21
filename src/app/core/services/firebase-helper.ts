import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

@Injectable()
export class FirebaseHelper
{
  firebaseRefs : any
  /**
   * Initializes this Firebase facade.
   * @constructor
   */
  constructor(
    private auth: AngularFireAuth,
    private database: AngularFireDatabase,
    private storage: AngularFireStorageModule) 
  {

    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  /**
   * Turns off all Firebase listeners.
   */
  cancelAllSubscriptions() {
    this.firebaseRefs.forEach((ref) => ref.off());
    this.firebaseRefs = [];
  }
}