import { Routes } from '@angular/router';

export const remindersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reminders-list/reminders.component').then((m) => m.RemindersComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create-reminder/reminder-add.component').then((m) => m.ReminderAddComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./reminder-detail/reminder-detail.component').then((m) => m.ReminderDetailComponent),
  },
];
