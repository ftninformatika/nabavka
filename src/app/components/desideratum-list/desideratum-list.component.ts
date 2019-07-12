import { Component, OnInit } from '@angular/core';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';

@Component({
  selector: 'app-desideratum-list',
  templateUrl: './desideratum-list.component.html',
  styleUrls: ['./desideratum-list.component.scss']
})
export class DesideratumListComponent  {

  editField: string;
  hide: Array<boolean> = [];
  hideInner: Array<boolean> = [];
  rowNum: number;
  // tslint:disable-next-line:max-line-length
  desideratList: Array<Desideratum> = [{
    isbn: '978-86-521-3299-7', title: 'Hej, nisam ti to pričala', author: 'Momo Kapor', publisher: 'Laguna', locations: [
      // tslint:disable-next-line:max-line-length
      {location: '04', sublocation: '0401', amount: 5}, {location: '03', sublocation: '0301', amount: 1}, {location: '04', sublocation: '0402', amount: 1}, {location: '03', sublocation: '0312', amount: 3}]
  },
    {
      isbn: ' 978-86-521-3359-8', title: 'Slika Dorijana Greja', author: 'Oskar Vajld', publisher: 'Prometej', locations: [
        {location: '04', sublocation: '0401', amount: 1}, {location: '04', sublocation: '0402', amount: 4}]
    }
  ];

// update desiderata
  updateList(isbn: string, property: string, event: any) {
    const editField = event.target.textContent;
    const book = this.desideratList.find(x => x.isbn === isbn);
    book[property] = editField;
  }


  remove(isbn: any) {
    this.desideratList.splice(isbn, 1);
  }


  add() {
    const book: Desideratum = {isbn: ' ', title: ' ', author: ' ', publisher: ' ' };
    this.desideratList.push(book);
  }

  addLoc(isbn: string, row: number) {

    const book = this.desideratList.find(x => x.isbn === isbn);
    const loc: Location = {location: ' ', sublocation: '', amount: 0};
    book.locations.push(loc);
    console.log(this.desideratList);
  }



  toggle(row) {
    this.hide[row] = !this.hide[row];

  }
  toggleInner(row) {
    this.hideInner[row] = !this.hideInner[row];

  }


}
