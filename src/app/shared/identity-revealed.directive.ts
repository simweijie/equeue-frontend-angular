import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const identityRevealedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const branchName = control.get('branchName');
  const branchTele = control.get('branchTele');
  const branchPcode = control.get('branchPcode');
  const branchAddr = control.get('branchAddr');

  return branchName === null || branchName === undefined ? { identityRevealed: true } : null;
};
