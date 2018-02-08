import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// Login Components
import { LoginComponent } from './login.component';

export const LoginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        data: {
           title: 'Login'
        }
    }
];

