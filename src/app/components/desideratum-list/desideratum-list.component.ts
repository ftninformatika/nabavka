import { Component, OnInit } from '@angular/core';

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
  desideratList: Array<any> = [{
    isbn: '978-86-521-3299-7', title: 'Hej, nisam ti to pričala', author: 'Momo Kapor', publisher: 'Laguna', locations: [
      // tslint:disable-next-line:max-line-length
      {locationOgr: '04', location: '0401', amount: 5}, {locationOgr: '03', location: '0301', amount: 1}, {locationOgr: '04', location: '0402', amount: 1}, {locationOgr: '03', location: '0312', amount: 3}]
  },
    {
      isbn: ' 978-86-521-3359-8', title: 'Slika Dorijana Greja', author: 'Oskar Vajld', publisher: 'Prometej', locations: [
        {locationOgr: '04', location: '0401', amount: 1}, {locationOgr: '04', location: '0402', amount: 4}]
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
    const book = {isbn: ' ', title: ' ', author: ' ', publisher: ' ' };
    this.desideratList.push(book);
  }

  addLoc(isbn: string, row: number) {

    const book = this.desideratList.find(x => x.isbn === isbn);
    const loc = {locationOgr: ' ', location: '', amount: 0};
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
