import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS} from '@angular/forms';
import {AcquisitionService} from '../services/acquisition.service';
import {Acquisition} from '../models/acquisition';

function isbnExists(acquisitionService: AcquisitionService) {
  return (c: AbstractControl) => {
    if (c.value != null) {
      return acquisitionService.isbnNotExists(c.value) ? null : {
        isbnExists: {
          exists: false
        }
      };
    } else {
      return null;
    }
  };
}

@Directive({
  selector: '[appIsbnExists][ngModel],[appIsbnExists][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => IsbnExistsValidatorDirective), multi: true }
  ]
})

export class IsbnExistsValidatorDirective {
  validator: (p: any) => any;

  constructor(acquisitionService: AcquisitionService) {
    this.validator = isbnExists(acquisitionService);
  }

  validate(c: AbstractControl) {
    return this.validator(c);
  }

}
