import {Component, OnInit, ViewChild} from '@angular/core';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {FirebaseService} from '../../services/firebase.service';
import {ModalDirective} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-desideratum-list',
  templateUrl: './desideratum-list.component.html',
  styleUrls: ['./desideratum-list.component.scss']
})

export class DesideratumListComponent implements OnInit {
  @ViewChild(ModalDirective, {static: false}) modal: ModalDirective;
  hide: Array<boolean> = [];
  hideInner: Array<boolean> = [];
  desiderataList: Desideratum[];
  location: Location = {};
  selectedId: string;
  rowIndex: number;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.firebaseService.getDesiderataData().subscribe(data => {
      this.desiderataList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        } as Desideratum;
      });
      console.log(this.desiderataList);
    });
  }

  add() {
    const book: Desideratum = {isbn: ' ', title: ' ', author: ' ', publisher: ' ' };
    this.firebaseService.addDesideratum(book)
      .then(docRef => {
        // book.id = docRef.id;
        // this.desiderataList.push(book);
      })
      .catch(error => {
      });
  }

  remove(id: string) {
    this.firebaseService.deleteDesideratum(id);
  }

  updateList(id: string, property: string, event: any) {
    const value = event.target.textContent;
    const book = this.desiderataList.find(x => x.id === id);
    book[property] = value;
    this.firebaseService.updateDesideratum(book);
  }

  showFrame(id: string) {
    this.selectedId = id;
    this.location = {};
    this.modal.show();
  }

  onSelect(rowIndex: number) {
    this.rowIndex = rowIndex;
  }

  addLocation() {
    this.location.location = this.location.sublocation.substring(0, 2);
    const book = this.desiderataList.find(x => x.id === this.selectedId);
    book.locations.push(this.location);
    this.firebaseService.updateDesideratum(book);
    this.modal.hide();
  }

  updateAmount(id: string, sublocation: string, event: any) {
    const value = event.target.textContent;
    const book = this.desiderataList.find(x => x.id === id);
    const location = book.locations.find(x => x.sublocation === sublocation);
    location.amount = value;
    this.firebaseService.updateDesideratum(book);
  }


  toggle(row) {
    this.hide[row] = !this.hide[row];

  }
  toggleInner(row) {
    this.hideInner[row] = !this.hideInner[row];

  }


}
