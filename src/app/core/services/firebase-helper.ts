import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

import {Material} from '../domain/material'

@Injectable()
export class FirebaseHelper
{
  firebaseRefs : firebase.database.Reference[]
  /**
   * Initializes this Firebase facade.
   * @constructor
   */
  constructor(
    private auth: AngularFireAuth,
    private database: AngularFireDatabase,
    private storage: AngularFireStorage) 
  {
    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  getAssetSrc(assetPath: string){
    return this.storage.ref(assetPath).getDownloadURL();
  }

  getDefaultMaterials() {

    const feedPromise = this._getFeed('default_materials').then((data) => {
      console.log(data)
      const entries = data.val() || {}
      return entries;
    })

    return feedPromise.then((res) => {
      console.log('default materials' + res)      
      const materialIds = Object.keys(res);
      var result : Material[] = []
      for (let i = materialIds.length - 1; i >= 0; i--) {
        var dbMaterial = res[materialIds[i]]
        console.log('i: ' + i + ' matId[i]: ' + materialIds[i]+ ' mat: ' + dbMaterial) 
        result.push(new Material(
          dbMaterial.uid, 
          dbMaterial.name, 
          dbMaterial.price_p, 
          dbMaterial.price_t, 
          dbMaterial.spec_weigth, 
          dbMaterial.img_url))
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
    doubleIndex : boolean = false)
  {
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
    relationTableName: string = "")
  {
    var newDataKey = this.database.database.ref().child(dataTableName).push().key;
    dataToAdd.id = newDataKey;

    return this._updateDataForUser(userId, newDataKey, dataToAdd, dataTableName, relationTableName)
  }
}