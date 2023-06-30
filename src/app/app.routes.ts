import { Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { HomeGuard } from './guards/home.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [ HomeGuard ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [ LoginGuard ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
