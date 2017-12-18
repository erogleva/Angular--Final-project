import { Component } from '@angular/core';
import { LoginModel } from "../../../core/models/login.model";
import { AuthenticationService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent  {
  public model: LoginModel;
  public loginFail: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.model = new LoginModel(" ", "");
  }

  login () : void {
    this.authService.login(this.model)
      .subscribe(
        data => {
          this.successfulLogin(data);
        },
        err => {
          this.loginFail = true;
        }
      )
  }

  successfulLogin(data) : void {
    this.authService.authtoken = data['_kmd']['authtoken'];
    localStorage.setItem('authtoken', data['_kmd']['authtoken']);
    localStorage.setItem('username', data['username']);
    this.loginFail = false;
    this.router.navigate(['/register']);
  }
}
