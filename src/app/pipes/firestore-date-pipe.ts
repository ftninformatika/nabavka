import {DatePipe, formatDate} from '@angular/common';
import {Inject, Pipe, PipeTransform} from '@angular/core';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

@Pipe({
  name: 'firestoreDate'
})

export class FirestoreDatePipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return super.transform((value as Timestamp).toDate(), 'dd.MM.yyyy.');
    } else {
      return '';
    }
  }
}
