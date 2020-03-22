import { Injectable } from '@angular/core';

import { Budget } from '../domain/budget'
import { FirebaseHelper } from './budget'

@Injectable()
export class ConfiguratorServiceService {

  currentSession : Budget

  constructor(firbaseHelper : FirebaseHelper) { }

}