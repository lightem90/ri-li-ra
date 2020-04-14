import {Component} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {AccountService} from '../../core/services/account.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm : FormGroup

  matcher = new RegisterErrorStateMatcher();

  constructor(
    private _service : AccountService,
    private _fb : FormBuilder){

  this.registerForm = _fb.group({
    emailFormControl: ["", [	
        Validators.maxLength(256),
        Validators.required,
        Validators.email]
      ],
    pswFormControl: ["", [      
        Validators.maxLength(32),	
        Validators.required]
      ],
    pswCheckFormControl: ["", [
        Validators.maxLength(32),		
        Validators.required]
      ]           
    })
  }

  register() {
    this._service.register(
      this.registerForm.get('emailFormControl').value, 
      this.registerForm.get('pswFormControl').value)
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class RegisterErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}