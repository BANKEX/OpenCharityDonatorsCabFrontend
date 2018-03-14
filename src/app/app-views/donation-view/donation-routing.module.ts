import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Dashboard Components
import { DonationComponent } from './donation.component';

export const DonationRoutes: Routes = [
    {
        path: '',
        component: DonationComponent,
        data: {
           title: 'Donations'
        }
    }
];

