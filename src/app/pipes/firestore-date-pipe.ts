import {DatePipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
import {firestore} from 'firebase/app';

@Pipe({
  name: 'firestoreDate'
})

export class FirestoreDatePipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      if (value instanceof firestore.Timestamp) {
        return super.transform((value as firestore.Timestamp).toDate(), 'dd.MM.yyyy.');
      } else {
        return super.transform(value, 'dd.MM.yyyy.');
      }
    } else {
      return '---';
    }
  }
}
