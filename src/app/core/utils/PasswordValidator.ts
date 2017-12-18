import { AbstractControl } from '@angular/forms';


export class PasswordValidator {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const repeatPassword = AC.get('repeatPassword').value;

    if (password !== repeatPassword) {
      AC.get('repeatPassword').setErrors({MatchPassword: true});
    } else {
      return null;
    }
  }
}
