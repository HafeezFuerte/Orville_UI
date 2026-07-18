import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInsightsComponent } from './my-insights/my-insights.component';
import { PropertiesListComponent } from '../portfolio/properties/properties-list/properties-list.component';
import { AddPropertyComponent } from '../portfolio/properties/create-new-property/add-property.component';
import { UnitsListComponent } from '../portfolio/units/units-list/units-list.component';
import { UnitDetailComponent } from '../portfolio/units/unit-detail/unit-detail.component';
import { AddUnitComponent } from '../portfolio/units/create-new-unit/add-unit.component';
import { RoomsListComponent } from '../portfolio/rooms/rooms-list/rooms-list.component';
import { AddRoomComponent } from '../portfolio/rooms/create-new-room/add-room.component';
import { ParkingsListComponent } from '../portfolio/parkings/parkings-list/parkings-list.component';
import { PropertyDetailComponent } from '../portfolio/properties/property-detail/property-detail.component';

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
{ path: 'properties/:code', component: PropertyDetailComponent },
{ path: 'units', component: UnitsListComponent },
{ path: 'rooms', component: RoomsListComponent },
{ path: 'parkings', component: ParkingsListComponent },
{ path: 'units/:id', component: UnitDetailComponent },
{ path: 'rooms/:id', component: UnitDetailComponent },

{
  path: 'add-property',
  component: AddPropertyComponent
},
{
  path: 'add-property/:code',
  component: AddPropertyComponent
},
{
  path: 'add-unit',
  component: AddUnitComponent
},
{
  path: 'edit-unit/:id',
  component: AddUnitComponent
},
{
  path: 'add-room',
  component: AddRoomComponent
},
{
  path: 'edit-room/:id',
  component: AddRoomComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}