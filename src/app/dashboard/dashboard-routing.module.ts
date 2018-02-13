import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Dashboard Components
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {
           title: 'Dashboard'
        }
    }
];

