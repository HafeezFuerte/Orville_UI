import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInsightsComponent } from './my-insights/my-insights.component';
import { ReportsComponent } from '../reports/reports.component';
import { DocumentCenterComponent } from '../document-center/document-center-list/document-center.component';
import { DocumentDetailComponent } from '../document-center/document-detail/document-detail.component';
import { DownloadCenterComponent } from '../download-center/download-center-list/download-center.component';
import { DownloadDetailComponent } from '../download-center/download-detail/download-detail.component';
import { ArchivesComponent } from '../archives/archives-list/archives.component';
import { EmailLogsComponent } from '../email-logs/email-logs-list/email-logs.component';
import { ActivityLogsComponent } from '../activity-logs/activity-logs-list/activity-logs.component';
import { MobileStatsComponent } from '../mobile-stats/mobile-stats-list/mobile-stats.component';
import { FeedbacksComponent } from '../feedbacks/feedbacks-list/feedbacks.component';
import { TrackedActionsComponent } from '../tracked-actions/tracked-actions-list/tracked-actions.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { PropertiesListComponent } from '../portfolio/properties/properties-list/properties-list.component';
import { AddPropertyComponent } from '../portfolio/properties/create-new-property/add-property.component';
import { UnitsListComponent } from '../portfolio/units/units-list/units-list.component';
import { UnitDetailComponent } from '../portfolio/units/unit-detail/unit-detail.component';
import { AddUnitComponent } from '../portfolio/units/create-new-unit/add-unit.component';
import { RoomsListComponent } from '../portfolio/rooms/rooms-list/rooms-list.component';
import { AddRoomComponent } from '../portfolio/rooms/create-new-room/add-room.component';
import { ParkingsListComponent } from '../portfolio/parkings/parkings-list/parkings-list.component';
import { PropertyDetailComponent } from '../portfolio/properties/property-detail/property-detail.component';
import { RoomDetailComponent } from '../portfolio/rooms/room-detail/room-detail.component';
export const admin: Routes = [
 {path:'dashboard',children:[ 
{
  path: 'crm',
  loadComponent: () =>
    import('./crm/crm.component').then((m) => m.CrmComponent),
}
]},
{ path: 'insights', component: MyInsightsComponent },
{ path: 'reports', component: ReportsComponent },
{ path: 'documents', component: DocumentCenterComponent },
{ path: 'documents/:id', component: DocumentDetailComponent },
{ path: 'downloads', component: DownloadCenterComponent },
{ path: 'downloads/:id', component: DownloadDetailComponent },
{ path: 'archives', component: ArchivesComponent },
{ path: 'email-logs', component: EmailLogsComponent },
{ path: 'activity-logs', component: ActivityLogsComponent },
{ path: 'mobile-stats', component: MobileStatsComponent },
{ path: 'feedbacks', component: FeedbacksComponent },
{ path: 'tracked-actions', component: TrackedActionsComponent },
{ path: 'profile', component: MyProfileComponent },
{ path: 'my-profile', component: MyProfileComponent },
{ path: 'properties', component: PropertiesListComponent },
{ path: 'properties/:code', component: PropertyDetailComponent },
{ path: 'units', component: UnitsListComponent },
{ path: 'rooms', component: RoomsListComponent },
{ path: 'parkings', component: ParkingsListComponent },
{ path: 'units/:id', component: UnitDetailComponent },
{ path: 'rooms/:id', component: RoomDetailComponent },

{
  path: 'add-property',
  component: AddPropertyComponent
},
{
  path: 'edit-property/:code',
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