import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DistributorsListComponent} from './components/distributors-list/distributors-list.component';
import {DesideratumListComponent} from './components/desideratum-list/desideratum-list.component';
import {OfferComponent} from './components/offer/offer.component';
import {AcquisitionComponent} from './components/acquisition/acquisition.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AccessDeniedComponent} from './components/access-denied/access-denied.component';
import {AcquisitionGuard} from './guards/acquisition.guard';
import {DesiderataGuard} from './guards/desiderata.guard';
import {DistributionLibraryComponent} from './components/distribution-library/distribution-library.component';

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AcquisitionGuard]},
  {path: 'acquisition/:id', component: AcquisitionComponent, canActivate: [AcquisitionGuard]},
  {path: 'distributors', component: DistributorsListComponent, canActivate: [AcquisitionGuard]},
  {path: 'offers/:pib', component: OfferComponent},
  {path: 'desiderata', component: DesideratumListComponent, canActivate: [DesiderataGuard]},
  {path: 'distribution', component: DistributionLibraryComponent, canActivate: [DesiderataGuard]},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
