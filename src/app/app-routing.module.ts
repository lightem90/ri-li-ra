import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivateChild } from '@angular/router';

import { LoginComponent } from './static/login/login.component';
import { RegisterComponent } from './static/register/register.component';
import { NotFoundComponent } from './static/not-found/not-found.component';
import { AboutComponent } from './static/about/about.component';
import { ContactsComponent } from './static/contacts/contacts.component';
import { FaqComponent } from './static/faq/faq.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'not-found', component: NotFoundComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contacts', component: ContactsComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'configurator', component: ConfiguratorComponent},
  { path: '', component: AppComponent},
  // { path: '**', redirectTo: '/not-found'}
  { path: '**', redirectTo: '/not-found'} // MUST BE LAST, IT IDENTIFIES ALL PATHS!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }