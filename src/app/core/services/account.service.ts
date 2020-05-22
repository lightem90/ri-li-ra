import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import {FirebaseHelper} from './firebase-helper'

@Injectable()
export class AccountService implements CanActivate {

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
      .then(r => this._router.navigate(['user']))     
  }

  register(email: string, password: string) {
    this._helper
      .register(email, password)
      .then(r => this._router.navigate(['login']))   
  }

  logout() {
    this._helper
      .logout()
      .then(_ => this._router.navigate(['']))
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
      : Observable<boolean> | Promise<boolean> | boolean {
      
      if (this.token) {
        this._router.navigate(['user'])        
        return false
      }
      
      return true
  }

  userIsLogged() {
    return this.token
  }

}