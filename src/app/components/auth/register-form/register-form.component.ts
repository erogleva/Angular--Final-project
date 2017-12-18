import { Component, OnInit } from '@angular/core';
import { RegisterModel } from "../../../core/models/register.model";
import { AuthenticationService } from "../../../core/services/auth.service";
import { FormGroup,
  FormBuilder,
  Validators,
  AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { PasswordValidator } from "../../../core/utils/PasswordValidator";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit{
  public model : RegisterModel;
  public registerSuccess : boolean;
  public registerFail : boolean;
  public registerForm: FormGroup;
  public emailValidationMessage: string;
  public nameValidationMessage: string;
  public passwordValidationMessage: string;
  public confirmPassValidationMessage: string;

  private nameValidationMessages = {
    required: 'Name is required!',
    maxlength: 'Name should not be longer than 64 characters!'
  };

  private emailValidationMessages = {
    required: 'Email is required!',
    pattern: 'Please enter a valid email!',
    maxlength: 'Email should not be longer than 254 characters!'
  };

  private passwordValidationMessages = {
    required: 'Password is required',
    pattern: 'Password should contain at least 6 characters, at least one number and one lowercase letter!'
  };


  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) {
    this.confirmPassValidationMessage = 'Passwords do not match!';
  }

  ngOnInit(): void{
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(254)]],
      name: ['', [Validators.required, Validators.maxLength(64)]],
      auth: this.formBuilder.group({
        password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z]).{6,}/)]],
        repeatPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z]).{6,}/)]]
      }, {validator: PasswordValidator.MatchPassword})
    });

    const nameControl = this.registerForm.get('name');
    nameControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => {
        this.nameValidationMessage = this.setMessage(nameControl, this.nameValidationMessage, this.nameValidationMessages);
      });

    const emailControl = this.registerForm.get('email');
    emailControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => {
        this.emailValidationMessage = this.setMessage(emailControl, this.emailValidationMessage, this.emailValidationMessages);
      });

    const passwordControl = this.registerForm.get('auth').get('password');
    passwordControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => {
        this.passwordValidationMessage = this.setMessage(passwordControl,
          this.passwordValidationMessage, this.passwordValidationMessages);
      });
  }

  register() : void {
    let {email, auth, name} = this.registerForm.value;
    this.model = new RegisterModel(email, auth.password, name);

    this.authService.register(this.model)
      .subscribe(
        data => {
          this.successfulRegister(data);
        },
        err => {
          this.registerFail = true;
        }
      )
  }

  successfulRegister(data): void {
    this.registerSuccess = true;
    this.authService.authtoken = data['_kmd']['authtoken'];
    localStorage.setItem('authtoken', data['_kmd']['authtoken']);
  }

  setMessage(c: AbstractControl, message: string, messagesCollection: Object): string {
    message = '';
    if ((c.touched || c.dirty) && c.errors) {
      message = Object.keys(c.errors)
        .map(key => messagesCollection[key])
        .join(' ');
    }
    return message;
  }
}
