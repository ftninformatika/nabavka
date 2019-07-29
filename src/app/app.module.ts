import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { environment } from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FirebaseService} from './services/firebase.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesideratumListComponent } from './components/desideratum-list/desideratum-list.component';
import { GroupByPipe } from './pipes/group-by.pipe';
import {FormsModule} from '@angular/forms';
import { DistributersListComponent } from './components/distributers-list/distributers-list/distributers-list.component';
import { OfferComponent } from './components/offer/offer.component';
import { SelectLocationComponent } from './components/select-location/select-location.component';

@NgModule({
  declarations: [
    AppComponent,
    DesideratumListComponent,
    GroupByPipe,
    DistributersListComponent,
    OfferComponent,
    SelectLocationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [
    MDBSpinningPreloader,
    FirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
