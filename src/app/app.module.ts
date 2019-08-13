import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {MDBBootstrapModulesPro, ToastModule} from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseService } from './services/firebase.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesideratumListComponent } from './components/desideratum-list/desideratum-list.component';
import { GroupByPipe } from './pipes/group-by.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DistributorsListComponent } from './components/distributors-list/distributors-list.component';
import { OfferComponent } from './components/offer/offer.component';
import { SelectLocationComponent } from './components/select-location/select-location.component';
import { AcquisitionComponent } from './components/acquisition/acquisition.component';
import {FirestoreDatePipe} from './pipes/firestore-date-pipe';
import { AcquisitionItemComponent } from './components/acquisition-item/acquisition-item.component';
import { LoginComponent } from './components/login/login.component';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsModule} from '@ngxs/store';
import {UserState} from './states/user.state';
import { StatusPipe } from './pipes/status.pipe';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeliveryItemComponent } from './components/delivery-item/delivery-item.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    DesideratumListComponent,
    GroupByPipe,
    DistributorsListComponent,
    OfferComponent,
    SelectLocationComponent,
    AcquisitionComponent,
    FirestoreDatePipe,
    AcquisitionItemComponent,
    LoginComponent,
    AcquisitionItemComponent,
    StatusPipe,
    DashboardComponent,
    DeliveryItemComponent,
    AccessDeniedComponent
  ],
  imports: [
    NgxsModule.forRoot([UserState]),
    NgxsStoragePluginModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule.forRoot({opacity: 1}),
    ClipboardModule
  ],
  providers: [
    MDBSpinningPreloader,
    FirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
