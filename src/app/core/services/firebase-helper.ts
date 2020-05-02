import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

import firebase from 'firebase';

import { Material } from '../domain/material'
import { FirebaseConstant } from './firebase-constant'

@Injectable()
export class FirebaseHelper
{
  private _authChangedSubject = new Subject<firebase.User>();
  private firebaseRefs : firebase.database.Reference[]

  _currentUser : firebase.User
  authChanged : Observable<firebase.User> = this._authChangedSubject

  constructor(
    private auth: AngularFireAuth,
    private database: AngularFireDatabase,
    private storage: AngularFireStorage) 
  {
    let self = this
    // recommended way to get the current user
    auth.auth.onAuthStateChanged(function(user) {
      self._authChangedSubject.next(user)
      this._currentUser = user
      }      
    )
    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  login(email: string, password: string) {
    return this.auth.auth
      .signInWithEmailAndPassword(email, password)
  }

  register(email: string, password: string) {
    return this.auth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(r => {
        this._addDataForUser(r.user.uid, {
          email : email,
          password : password
        },
        FirebaseConstant.entityTableNames.user)
      })
  }
  

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.auth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.auth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      });
    });
  }

  signInAnonymously(){
    return new Promise<any>((resolve, reject) => {
      this.auth.auth
      .signInAnonymously()
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }  

  getAssetSrc(assetPath: string){
    return this.storage.ref(assetPath).getDownloadURL();
  }

  getMaterials(defaultMaterials : boolean = false) {
    let feedPromise : Promise<any> = null
    //todo 
    const user_id = "ciccio"

    if (defaultMaterials === null){
      feedPromise = this._getFeed(FirebaseConstant.entityTableNames.default_materials)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })
    } else {
      feedPromise = this._getFeed(FirebaseConstant.entityTableNames.material + '/' + user_id)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })
    }

    return feedPromise.then((res) => {    
      const materialIds = Object.keys(res);
      var result : Material[] = []
      for (let i = 0; i < materialIds.length; i++) {
        var dbMaterial = res[materialIds[i]]
        result.push(new Material().map(dbMaterial))
      }

      return result;
    })
  }

  /**
   * Turns off all Firebase listeners.
   */
  cancelAllSubscriptions() {
    this.firebaseRefs.forEach((ref) => ref.off());
    this.firebaseRefs = [];
  }

  _getFeed(uri: string){
    return this.database.database.ref(uri).once('value')
  }

  _updateDataForUser(
    userId: string,
    dataKey: string, 
    dataToAdd: any, 
    dataTableName: string) {

    var updates = {};
    updates['/' + dataTableName + '/' + userId + '/' + dataKey] = dataToAdd;

    return this.database.database.ref().update(updates);
  }

  //adds into a table a new document
  _addDataForUser(
    userId: string, 
    dataToAdd: any, 
    dataTableName: string) {

    var newDataKey = this.database.database
      .ref()
      .child(dataTableName + '/' + userId)
      .push()
      .key;

    dataToAdd.uid = newDataKey;

    return this._updateDataForUser(userId, newDataKey, dataToAdd, dataTableName)
  }
}