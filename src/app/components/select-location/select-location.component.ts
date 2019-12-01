import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Desideratum} from '../../models/desideratum';
import {Sublocation} from '../../models/location_coder';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {

  @Input() value: any;
  @Output() selectedLocationEvent: EventEmitter<any> = new EventEmitter<any>();

  values = [];

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.getSublocations().subscribe(data => {
      this.values = data.map(s => {
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
