import { Component, OnInit } from '@angular/core';
import {Acquisition} from '../../models/acquisition';
import {FirebaseService} from '../../services/firebase.service';
import {Desideratum} from '../../models/desideratum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  acquisitionList: Acquisition[] = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAcquisitionListOnce().subscribe(data => {
      this.acquisitionList = data.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as Acquisition;
      });
    });
  }

}
