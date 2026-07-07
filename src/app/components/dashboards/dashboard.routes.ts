import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInsightsComponent } from './my-insights/my-insights.component';
import { PropertiesListComponent } from '../components/properties-list/properties-list.component';
export const admin: Routes = [
 {path:'dashboard',children:[ 
{
  path: 'crm',
  loadComponent: () =>
    import('./crm/crm.component').then((m) => m.CrmComponent),
}
]},
{ path: 'insights', component: MyInsightsComponent },
{ path: 'properties', component: PropertiesListComponent },
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}