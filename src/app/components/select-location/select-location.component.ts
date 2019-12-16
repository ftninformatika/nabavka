import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
          value: s.coder_id,
          label: s.coder_id + ' - ' + s.description
        };
      });
    });
  }

  getSelectedValue(event: any) {
    this.selectedLocationEvent.emit(event);
  }

}
