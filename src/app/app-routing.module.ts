import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivateChild } from '@angular/router';

import { LoginComponent } from './static/login/login.component';
import { RegisterComponent } from './static/register/register.component';
import { NotFoundComponent } from './static/register/not-found.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'not-found', component: NotFoundComponent},
  { path: '', component: AppComponent},
  // { path: '**', redirectTo: '/not-found'}
  { path: '**', redirectTo: '/not-found'} // MUST BE LAST, IT IDENTIFIES ALL PATHS!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }