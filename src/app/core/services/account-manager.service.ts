import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { FirebaseHelper } from './firebase-helper'
import { FirebaseConstant } from './firebase-constant'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import {Material} from '../domain/material'
import { Work, ExternalWork } from '../domain/work';

@Injectable()
export class AccountManagerService {

  constructor(
    private _firbaseHelper : FirebaseHelper, 
    private _router: Router) { }

  saveMaterialForCurrentUser(materials: Material[]) {
    for(const mat of materials){      
      this._firbaseHelper._addDataForUser(
        mat.map_to_db(),
        FirebaseConstant.entityTableNames.material
      )
    }
  }    
  //lasciamo al chiamante il dovere di chiedere quelli di default o specifici per l'utente
  getMaterials(getDefault : boolean = false){
    return this._firbaseHelper.getMaterials(getDefault)
    .then(res => {
        if (res)
        {
          res.forEach(mat => {            
            this.getAssetUrl(mat.img_url)
              .subscribe(res => {
                if (res && !mat.img_download_url) {                  
                  mat.img_download_url = res
                }
            })
          })  
          return res   
        } else {
          console.log('Error fetching default materials')
          return []
        }
      }, err => console.log(err))
  }

  saveWorkForUser(work : Work){
    return this._firbaseHelper._addDataForUser(
          work,
          FirebaseConstant.relationTableNames.userWork)
  }

  saveExternalWorkForUser(extWork : ExternalWork) {
    return this._firbaseHelper._addDataForUser(
          extWork,
          FirebaseConstant.relationTableNames.userService)

  }
  
  registerToWorkChange(work: Work, callback) {
    this._firbaseHelper.registerToChange(
      FirebaseConstant.relationTableNames.userWork,
      work.uid,
      callback)
  }

  registerToServiceChange(serv: ExternalWork, callback) {
    this._firbaseHelper.registerToChange(
      FirebaseConstant.relationTableNames.userService,
      serv.uid,
      callback)
  }

  registerToMaterialChange(material: Material, callback) {
    this._firbaseHelper.registerToChange(
      FirebaseConstant.relationTableNames.userMaterial,
      material.uid,
      callback)
  }


  fetchInternalUserWorks() {
    return this._firbaseHelper.getUserWorks()
  }

  fetchExternalUserWorks() {
    return this._firbaseHelper.getUserServices()
  }

  deleteUserWork(workId : string) {
    this._firbaseHelper
      .deleteEntryForUser(FirebaseConstant.relationTableNames.userWork, workId)
  }

  deleteUserService(extworkId : string) {
    this._firbaseHelper
      .deleteEntryForUser(FirebaseConstant.relationTableNames.userService, extworkId)
  }

  getAssetUrl(assetUrl : string){
    //take 1 so i don't need to unsubscribe
    return this._firbaseHelper.getAssetSrc(assetUrl).pipe(take(1))
  }

}