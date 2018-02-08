import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// Login Components
import { RegistrationComponent } from './registration.component';

export const RegistrationRoutes: Routes = [
    {
        path: '',
        component: RegistrationComponent,
        data: {
           title: 'Registration'
        }
    }
];

