import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { FirebaseHelper } from './firebase-helper'
import { FirebaseConstant } from './firebase-constant'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import {Material} from '../domain/material'
import { Work, ExternalWork } from '../domain/work';
import { AccountService } from './account.service';

@Injectable()
export class AccountManagerService implements CanActivate {

  worksChanged : EventEmitter<Work[]> = new EventEmitter<Work[]>()
  servicesChanged : EventEmitter<ExternalWork[]> = new EventEmitter<ExternalWork[]>()
  materialsChanged : EventEmitter<Material[]> = new EventEmitter<Material[]>()

  userWorks : Work[] = []
  userServices : ExternalWork[] = []
  userMaterial : Material[] = []

  constructor(
    private _accountService : AccountService,
    private _firbaseHelper : FirebaseHelper, 
    private _router: Router) {

    this._subscribeToListChanges(
      FirebaseConstant.relationTableNames.userWork,
      this.userWorks,
      this.worksChanged)

        
    this._subscribeToListChanges(
      FirebaseConstant.relationTableNames.userService,
      this.userServices,
      this.servicesChanged)

      
    this._subscribeToListChanges(
      FirebaseConstant.relationTableNames.userMaterial,
      this.userMaterial,
      this.materialsChanged)
  }

  _subscribeToListChanges(name : string, list, event){

      this._firbaseHelper
        .subscribeToListChanges(name,
        (itemAdd) => {
          list.push(itemAdd)
          event.emit(list.slice())
        }, 
        (itemDel) => {
          const index = list.findIndex(w => w.uid === itemDel.uid)
          if (index !== -1) {
            list = list.splice(index, 1)
            event.emit(list.slice())
          }
      })
  }

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
          this.userMaterial = res.slice()
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
    return this._firbaseHelper
      .getUserWorks()
      .then(res => this.userWorks = res.slice())
  }

  fetchExternalUserWorks() {
    return this._firbaseHelper
      .getUserServices()
      .then(res => this.userServices = res.slice())
  }

  fetchUserBudgets() {
    return this._firbaseHelper
      .getUserBudgets()
      .then(res => this.userServices = res.slice())
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
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
      : Observable<boolean> | Promise<boolean> | boolean {

      if (this._accountService.userIsLogged()) return true

      this._router.navigate(['login'])
      return false
  }

}