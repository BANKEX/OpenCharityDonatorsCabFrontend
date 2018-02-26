import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardListRoutes } from './dashboard-list-routing.module';

import { CommonModule } from '@angular/common';

// Dashboard Component
import { DashboardListComponent } from './dashboard-list.component';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardListRoutes),
        CommonModule
    ],
    declarations: [
        DashboardListComponent
    ],
    providers: []
})
export class DashboardListModule { }
