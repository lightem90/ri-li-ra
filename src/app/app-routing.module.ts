import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivateChild } from '@angular/router';

import { LoginComponent } from './static/login/login.component';
import { RegisterComponent } from './static/register/register.component';
import { NotFoundComponent } from './static/not-found/not-found.component';
import { AboutComponent } from './static/about/about.component';
import { ContactsComponent } from './static/contacts/contacts.component';
import { FaqComponent } from './static/faq/faq.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { HomeConfiguratorComponent } from './home-configurator/home-configurator.component';
import { UserLandingComponent } from './user-landing/user-landing.component'
import { AppComponent } from './app.component'

import { ConfiguratorService } from './core/services/configurator.service'
import { canActivate } from '@angular/fire/auth-guard';
import { AccountService } from './core/services/account.service';
import { AccountManagerService } from './core/services/account-manager.service';

import { BudgetPrintComponent } from './shared/budget-print/budget-print.component';

const routes: Routes = [
  { path: 'login', 
    canActivate: [AccountService],
    component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'not-found', component: NotFoundComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contacts', component: ContactsComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'user', 
    canActivate: [AccountManagerService],
    component: UserLandingComponent},  
  { path: 'configurator', 
    canActivate: [ConfiguratorService],
    component: ConfiguratorComponent},
  { path: 'budget/:id', component: BudgetPrintComponent },
  { path: 'budget', component: BudgetPrintComponent },
  { path: '', component: HomeConfiguratorComponent},
  // { path: '**', redirectTo: '/not-found'}
  { path: '**', redirectTo: '/not-found'} // MUST BE LAST, IT IDENTIFIES ALL PATHS!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }