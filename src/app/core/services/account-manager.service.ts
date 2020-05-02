import { Injectable } from '@angular/core';
import { FirebaseHelper } from './firebase-helper'
import { FirebaseConstant } from './firebase-constant'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import {Material} from '../domain/material'

@Injectable()
export class AccountManagerService {

  private test_user : string = "ciccio"

  constructor(
    private _firbaseHelper : FirebaseHelper, 
    private _router: Router) { }



    fectchMaterialsForCurrentUser() {      
      return this._firbaseHelper.getMaterials()
    }

    saveMaterialForCurrentUser(materials: Material[]) {
      for(const mat of materials){      
        this._firbaseHelper._addDataForUser(
          this.test_user,
          mat.map_to_db(),
          FirebaseConstant.entityTableNames.material
        )
      }
    }

}