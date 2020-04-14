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

  authChanged : Observable<firebase.User> = this._authChangedSubject

  constructor(
    private auth: AngularFireAuth,
    private database: AngularFireDatabase,
    private storage: AngularFireStorage) 
  {
    let self = this
    // recommended way to get the current user
    auth.auth.onAuthStateChanged(function(user) {
      self._authChangedSubject.next(user)}      
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
        FirebaseConstant.entityTableNames.user,  
        FirebaseConstant.relationTableNames.userRole)
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

  getDefaultMaterials() {
    const feedPromise = this._getFeed('default_materials').then((data) => {
      const entries = data.val() || {}
      return entries;
    })

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
    dataTableName: string,
    relationTableName: string = "",
    doubleIndex : boolean = false) {

    var updates = {};
    updates['/' + dataTableName + '/' + dataKey] = dataToAdd;
    
    if (relationTableName != "") {
      if (doubleIndex){
        updates['/' + relationTableName + '/' + userId + '/' + dataKey] = dataToAdd
        }
        else {
        updates['/' + relationTableName + '/' + userId] = dataToAdd
      }
    }
    return this.database.database.ref().update(updates);
  }

  //adds into a table a new document and if any a relation table for selected user
  _addDataForUser(
    userId: string, 
    dataToAdd: any, 
    dataTableName: string,
    relationTableName: string = "") {

    var newDataKey = this.database.database.ref().child(dataTableName).push().key;
    dataToAdd.id = newDataKey;

    return this._updateDataForUser(userId, newDataKey, dataToAdd, dataTableName, relationTableName)
  }
}