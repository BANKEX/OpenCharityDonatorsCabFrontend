import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// Dashboard List Components
import { DashboardListComponent } from './dashboard-list.component';

export const DashboardListRoutes: Routes = [
    {
        path: '',
        component: DashboardListComponent,
        data: {
           title: 'Dashboard'
        }
    }
];

