import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { admin, dashboardRoutingModule } from '../../components/dashboards/dashboard.routes';
import { servicesRoutingModule } from '../../components/services/services.routes'; 

export const content: Routes = [
  {
    path: '',
    children: [ 
      ...dashboardRoutingModule.routes,
    ],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('../../components/contacts/contacts.routes').then((m) => m.contactsRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(admin)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }