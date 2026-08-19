import { Routes } from '@angular/router';

export const remindersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reminders-list/reminders.component').then((m) => m.RemindersComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./reminder-detail/reminder-detail.component').then((m) => m.ReminderDetailComponent)
  }
];
