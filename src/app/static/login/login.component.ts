import {Component} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {AccountService} from '../../core/services/account.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  constructor(private _service : AccountService) {

  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  pswFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new LoginErrorStateMatcher();

  login() {
    this._service.login(
      this.emailFormControl.value, 
      this.pswFormControl.value)
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}