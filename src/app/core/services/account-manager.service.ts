import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { FirebaseHelper } from './firebase-helper'
import { FirebaseConstant } from './firebase-constant'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import {Material} from '../domain/material'
import { Work } from '../domain/work';

@Injectable()
export class AccountManagerService {

  constructor(
    private _firbaseHelper : FirebaseHelper, 
    private _router: Router) { }

    fectchMaterialsForCurrentUser() {      
      return this._firbaseHelper.getMaterials()
    }

    saveMaterialForCurrentUser(materials: Material[]) {
      for(const mat of materials){      
        this._firbaseHelper._addDataForUser(
          mat.map_to_db(),
          FirebaseConstant.entityTableNames.material
        )
      }
    }    

  getAssetUrl(assetUrl : string){
    //take 1 so i don't need to unsubscribe
    return this._firbaseHelper.getAssetSrc(assetUrl).pipe(take(1))
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

}