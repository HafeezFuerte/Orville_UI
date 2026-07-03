import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
export const admin: Routes = [
 {path:'dashboard',children:[ 
{
  path: 'crm',
  loadComponent: () =>
    import('./crm/crm.component').then((m) => m.CrmComponent),
},
{ path: 'my-dashboard', component: MyDashboardComponent },

]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}