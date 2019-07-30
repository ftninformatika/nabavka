import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DistributersListComponent} from './components/distributers-list/distributers-list/distributers-list.component';
import {DesideratumListComponent} from './components/desideratum-list/desideratum-list.component';
import {OfferComponent} from './components/offer/offer.component';
import {AcquisitionComponent} from './components/acquisition/acquisition.component';

const routes: Routes = [
  {path: '', component: AcquisitionComponent},
  {path: 'distributers', component: DistributersListComponent},
  {path: 'offers/:pib', component: OfferComponent},
  {path: 'desiderata', component: DesideratumListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
