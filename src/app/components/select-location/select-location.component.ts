import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Desideratum} from '../../models/desideratum';
import {Sublocation} from '../../models/location_coder';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {

  @Input() value: any;
  @Output() selectedLocationEvent: EventEmitter<any> = new EventEmitter<any>();

  values = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getSublocations().subscribe(data => {
      this.values = data.map(e => {
        const s = e.payload.doc.data() as Sublocation;
        return {
          value: s.code,
          label: s.code + ' - ' + s.name
        };
      });
    });
  }

  getSelectedValue(event: any) {
    this.selectedLocationEvent.emit(event);
  }

}
