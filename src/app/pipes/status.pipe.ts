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
        return 'Затворена';
      }
      case 'delivery': {
        return 'Достава';
      }
      default: {
        return '';
      }
    }
  }

}
