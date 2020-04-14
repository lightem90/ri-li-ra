import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {FirebaseHelper} from './firebase-helper'

@Injectable()
export class AccountService {

  token: string;
  private currentUser = null;

  constructor(private _helper : FirebaseHelper) { 

    this._helper.authChanged.subscribe(user => {
      if (user){
        this.currentUser = user
        user.getIdToken().then(res => this.token = res)
      }
    })
  }

  login(email: string, password: string) {
    this._helper.login(email, password)
  }

  register(email: string, password: string) {
    this._helper.register(email, password)
  }

}