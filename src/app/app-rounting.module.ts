import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginFormComponent} from "./components/auth/login-form/login-form.component";
import {RegisterFormComponent} from "./components/auth/register-form/register-form.component";


const routes: Routes = [
  {path: 'login',  component: LoginFormComponent},
  {path: 'register',  component: RegisterFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
