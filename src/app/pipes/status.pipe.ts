import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class StatusPipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
      case 'open': {
        return 'У припреми';
      }
      case 'closed': {
        return 'Формирана';
      }
      case 'distribution': {
        return 'Расподела';
      }
      case 'delivery': {
        return 'Испорука';
      }
      default: {
        return '';
      }
    }
  }

}
