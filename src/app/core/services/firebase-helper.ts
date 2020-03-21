import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

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

  test(){
    this.updateDataForUser('aa', 'test', {aa: 'aa'}, 'tt')
  }

  updateDataForUser(
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
  addDataForUser(
    userId: string, 
    dataToAdd: any, 
    dataTableName: string,
    relationTableName: string = "")
  {
    var newDataKey = this.database.database.ref().child(dataTableName).push().key;
    dataToAdd.id = newDataKey;

    return this.updateDataForUser(userId, newDataKey, dataToAdd, dataTableName, relationTableName)
  }
}