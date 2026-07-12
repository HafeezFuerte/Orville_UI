import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInsightsComponent } from './my-insights/my-insights.component';
import { PropertiesListComponent } from '../components/properties-list/properties-list.component';
import { AddPropertyComponent } from '../components/create-new-property/add-property.component';
import { UnitsListComponent } from '../components/units-list/units-list.component';
import { UnitDetailComponent } from '../components/unit-detail/unit-detail.component';

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
{ path: 'properties/:id', component: UnitDetailComponent },
{ path: 'units', component: UnitsListComponent },
{ path: 'units/:id', component: UnitDetailComponent },
{ path: 'rooms/:id', component: UnitDetailComponent },
{ path: 'parkings/:id', component: UnitDetailComponent },
{
  path: 'add-property',
  component: AddPropertyComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}