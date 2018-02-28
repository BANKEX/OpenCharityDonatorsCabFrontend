import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// Dashboard List Components
import { SearchComponent } from './search.component';

export const SearchRoutes: Routes = [
    {
        path: '',
        component: SearchComponent,
        data: {
           title: 'Search'
        }
    }
];

