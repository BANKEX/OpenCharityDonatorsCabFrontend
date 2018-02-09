import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardService } from './services/guard-service';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        canActivate: [GuardService],
        pathMatch: 'full',
        data: {
          roleAccess: ['USER']
        }
    },
    {
        path: '',
        component: CommonLayoutComponent,
        canActivate: [GuardService],
        data: {
          roleAccess: ['USER']
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }
        ]
    },
    {
      path: 'registration',
      loadChildren: './registration-view/registration.module#RegistrationModule',
      data: {
        roleAccess: ['UNAUTHORIZED']
      }
    },
    {
      path: 'login',
      loadChildren: './login-view/login.module#LoginModule',
      data: {
        roleAccess: ['UNAUTHORIZED']
      }
    }
];

