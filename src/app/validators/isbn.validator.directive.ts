import { Directive } from '@angular/core';
import {NG_VALIDATORS, AbstractControl} from '@angular/forms';

function validateIsbn(c: AbstractControl) {
  if (c.value !== null && c.value !== undefined && c.value !== '') {
    return isIsbnValid(c.value) ? null : {
      validateIsbn: {
        valid: false
      }
    };
  } else {
    return null;
  }
}

function isIsbnValid(isbn: string): boolean {
  const numericString = isbn.replace(/\D/g, '');
  const isbnLength = numericString.length;
  if (!(isbnLength === 13 || isbnLength === 10)) {
    return false;
  }

  const regexpIsbn: RegExp = /(?=^.{17}$)97[89]-(?:[0-9]+-){2}[0-9]+-[0-9]|(?=^.{13}$)(?:[0-9]+-){2}[0-9]+-[0-9Xx]/;
  if (!regexpIsbn.test(isbn)) {
    return false;
  }

  const ISBN10WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const ISBN13WEIGHTS = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1];

  const checksum = (arr, weights) => arr
    .reduce((a, x, i) => {
      a.push([Number(x), weights[i]]);
      return a;
    }, [])
    .reduce((sum, a) => sum + a[0] * a[1], 0);

  if (isbnLength === 10 && checksum(numericString.split(''), ISBN10WEIGHTS) % 11 === 0) {
    return true;
  } else if (isbnLength === 13 && checksum(numericString.split(''), ISBN13WEIGHTS) % 10 === 0) {
    return true;
  } else {
    return false;
  }
}

@Directive({
  selector: '[appIsbn][ngModel],[appIsbn][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validateIsbn, multi: true }
  ]
})

export class IsbnValidatorDirective {}
