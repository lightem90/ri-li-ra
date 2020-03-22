import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';

import { Budget } from '../domain/budget'
import { FirebaseHelper } from './firebase-helper'

@Injectable()
export class ConfiguratorService implements CanActivate {

  currentSession : Budget = null
  test = false

  constructor(
    private firbaseHelper : FirebaseHelper, 
    private router: Router) { }

  //needed to display configurator only if session has started, otherwise I'll show the button to start
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.isSessionActive())
      {
        return true;
      }

      this.router.navigate(['/'])
      return false;
    }

  startNewSession() {
    //firebase
    this.test = true
  }

  isSessionActive(){
    return this.test
    //return this.currentSession !== null
  }

}