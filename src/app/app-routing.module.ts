import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DistributersListComponent} from './components/distributers-list/distributers-list/distributers-list.component';
import {DesideratumListComponent} from './components/desideratum-list/desideratum-list.component';
import {OfferComponent} from './components/offer/offer.component';

const routes: Routes = [
  {path: '', component: DesideratumListComponent},
  {path: 'distributers', component: DistributersListComponent},
  {path: 'offers/:pib', component: OfferComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
