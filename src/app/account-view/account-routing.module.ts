import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// Login Components
import { AccountComponent } from './account.component';

export const AccountRoutes: Routes = [
    {
        path: '',
        component: AccountComponent,
        data: {
           title: 'Account'
        }
    }
];

