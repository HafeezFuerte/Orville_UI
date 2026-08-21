import { Routes } from '@angular/router';

export const inspectionsRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./inspections.component').then(m => m.InspectionsComponent)
  },
  {
    path: 'add-inspection',
    loadComponent: () => import('./add-inspection/add-inspection.component').then(m => m.AddInspectionComponent)
  },
  {
    path: 'inspection-details',
    loadComponent: () => import('./inspection-details/inspection-details.component').then(m => m.InspectionDetailsComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./templates/templates.component').then(m => m.TemplatesComponent)
  },
  {
    path: 'create-template',
    loadComponent: () => import('./templates/create-template/create-template.component').then(m => m.CreateTemplateComponent)
  },
  {
    path: 'template-details',
    loadComponent: () => import('./templates/template-details/template-details.component').then(m => m.TemplateDetailsComponent)
  }
];
