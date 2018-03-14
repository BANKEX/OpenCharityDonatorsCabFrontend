import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Dashboard Components
import { EventComponent } from './event.component';

export const EventRoutes: Routes = [
    {
        path: '',
        component: EventComponent,
        data: {
           title: 'Events'
        }
    }
];

