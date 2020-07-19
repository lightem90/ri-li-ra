import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList , AngularFireObject } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import firebase from 'firebase';

import { Material } from '../domain/material'
import { FirebaseConstant } from './firebase-constant'
import { Work, ExternalWork } from '../domain/work';

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
    private storage: AngularFireStorage) {
    let self = this
    // recommended way to get the current user
    auth.onAuthStateChanged(function(user) {
      if (user){
        self._updateUser(user)
      }
    })
    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  _updateUser(newUser : firebase.User) {
      this._currentUser = newUser
      this._authChangedSubject.next(newUser)
  }

  login(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
  }

  logout(){
    return this.auth.signOut()
  }

  register(email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(r => {
        this.addOrUpdateDataForUser({
          email : email,
          password : password
        },
        FirebaseConstant.entityTableNames.user)
      })
  }
  

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.auth
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
      this.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      });
    });
  }

  signInAnonymously(){
    return new Promise<any>((resolve, reject) => {
      this.auth
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

  getMaterials(getDefault : boolean = false) {
    let feedPromise : Promise<any> = null

    if (getDefault === true || !this._currentUser){
      feedPromise = this._getFeed(FirebaseConstant.entityTableNames.default_materials)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })
    } else {
      feedPromise = this._getFeed(FirebaseConstant.entityTableNames.material + '/' + this._currentUser.uid)
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

  getUserWorks(){
    
    if (this._currentUser) {
      let feedPromise : Promise<any> = 
        this._getFeed(
          FirebaseConstant.relationTableNames.userWork 
          + '/' 
          + this._currentUser.uid)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })

      return feedPromise.then(res => {
        const worksId = Object.keys(res);
        var result : Work[] = []
        for (let i = 0; i < worksId.length; i++) {
          var dbWork = res[worksId[i]]
          result.push(dbWork)
        }
        return result;
      })
    } 
    
    return new Promise<Work[]>(resolve => resolve([]))
  }

  registerToChange(tableName, uid, callback) {
    if (this._currentUser.uid) {
      const ref =
          this.database.database.ref(
            `/${tableName}/${this._currentUser.uid}/${uid}`);
      ref.on('value', callback);
      this.firebaseRefs.push(ref);
    }
  }

  subscribeToListChanges(tableName, callbackAdd, callbackDel) {
    if (this._currentUser) {
      // Load all posts information.
      let feedRef = this.database.database.ref(`/${tableName}/${this._currentUser.uid}`)       

      feedRef.on('child_added', (feedData) => { 
        callbackAdd(feedData.val());
      })  

      feedRef.on('child_removed', (feedData) => { 

        callbackDel(feedData.val());

        this.database.database.ref(`/${tableName}/${this._currentUser.uid}/${feedData.key}`).off();
      })    
    }    
  }

  getUserBudgets() {
    
    if (this._currentUser) {
      let feedPromise : Promise<any> = 
        this._getFeed(
          FirebaseConstant.relationTableNames.userBudget 
          + '/' 
          + this._currentUser.uid)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })

      return feedPromise.then(res => {

        const budgetId = Object.keys(res);
        var result : any[] = []
        for (let i = 0; i < budgetId.length; i++) {
          var budget = res[budgetId[i]]
          result.push(budget)
        }

        return result;
      })
    } 
    return new Promise<any[]>(res => res([])) 
  }

  getUserServices() {

    if (this._currentUser) {
      let feedPromise : Promise<any> = 
        this._getFeed(
          FirebaseConstant.relationTableNames.userService 
          + '/' 
          + this._currentUser.uid)
        .then((data) => {
          const entries = data.val() || {}
          return entries;
      })

      return feedPromise.then(res => {

        const worksId = Object.keys(res);
        var result : ExternalWork[] = []
        for (let i = 0; i < worksId.length; i++) {
          var dbWork = res[worksId[i]]
          result.push(dbWork)
        }

        return result;
      })
    } 
    return new Promise<ExternalWork[]>(resolve => resolve([]))    
  }

  deleteEntryForUser(tableName : string, entryId : string) {
    this.database.database
      .ref(tableName 
          + '/' 
          + this._currentUser.uid 
          + '/'
          + entryId)
      .remove()
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
    dataKey: string, 
    dataToAdd: any, 
    dataTableName: string) {

    var updates = {};
    updates['/' + dataTableName + '/' + this._currentUser.uid + '/' + dataKey] = dataToAdd;

    return this.database.database.ref().update(updates);
  }

  //adds into a table a new document
  addOrUpdateDataForUser(
    dataToAdd: any, 
    dataTableName: string) {

    //console.log(dataToAdd.uid)
    if (!dataToAdd.uid || dataToAdd.uid === "") { //no uid = add
        
        var newDataKey = this.database.database
        .ref()
        .child(dataTableName + '/' + this._currentUser.uid)
        .push()
        .key;
      dataToAdd.uid = newDataKey;

      return this._updateDataForUser(newDataKey, dataToAdd, dataTableName)
    } else { //yes uid = update
            
      var updates = {};
      updates['/' + dataTableName + '/' + this._currentUser.uid + '/' + dataToAdd.uid] = dataToAdd;
      
      return this.database.database.ref().update(updates);
    }
    
  }  
}