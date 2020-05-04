import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import {FirebaseHelper} from './firebase-helper'

@Injectable()
export class AccountService {

  token: string;
  private currentUser = null;

  constructor(
    private _helper : FirebaseHelper,
    private _router : Router) { 

    this._helper.authChanged.subscribe(user => {
      if (user){
        this.currentUser = user
        user.getIdToken()
          .then(res => {
            this.token = res
          })
      }
    })
  }

  login(email: string, password: string) {
    this._helper
      .login(email, password)
      .then(ok => {
        this._router.navigate(['user'])
      })
  }

  register(email: string, password: string) {
    this._helper
      .register(email, password)      
      .then(ok => {
        this._router.navigate(['login'])
      })
  }

}