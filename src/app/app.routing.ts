import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardService } from './app-services/guard.service';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        data: {
          roleAccess: ['USER']
        }
    },
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './app-views/dashboard-list/dashboard-list.module#DashboardListModule'
            },
            {
                path: 'dashboard/:id',
                loadChildren: './app-views/dashboard-view/dashboard.module#DashboardModule'
            },
            {
                path: 'search/:searchValue',
                loadChildren: './app-views/search-view/search.module#SearchModule'
            }
        ]
    },
    {
      path: 'account',
      component: CommonLayoutComponent,
      canActivate: [GuardService],
      loadChildren: './app-views/account-view/account.module#AccountModule',
      data: {
        roleAccess: ['USER']
      }
    },
    {
      path: 'registration',
      loadChildren: './app-views/registration-view/registration.module#RegistrationModule'
    },
    {
      path: 'login',
      loadChildren: './app-views/login-view/login.module#LoginModule'
    }
];

