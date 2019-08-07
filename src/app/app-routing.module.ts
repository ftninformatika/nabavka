import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DistributorsListComponent} from './components/distributors-list/distributors-list.component';
import {DesideratumListComponent} from './components/desideratum-list/desideratum-list.component';
import {OfferComponent} from './components/offer/offer.component';
import {AcquisitionComponent} from './components/acquisition/acquisition.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'acquisition/:id', component: AcquisitionComponent},
  {path: 'distributers', component: DistributersListComponent},
  {path: 'offers/:pib', component: OfferComponent},
  {path: 'desiderata', component: DesideratumListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
