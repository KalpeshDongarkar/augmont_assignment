import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passMatcher_Vldfn(control: AbstractControl): ValidationErrors | null {
  const password = control.get('usrPass');
  const confirmPassword = control.get('confUsrPass');

  if (!password || !confirmPassword || password.pristine || confirmPassword.pristine) {
    return null;
  }

  return password.value !== confirmPassword.value ? { pMisMtch: true } : null;
}
