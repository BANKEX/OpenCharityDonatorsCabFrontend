import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchRoutes } from './search-routing.module';

import { CommonModule } from '@angular/common';

// Dashboard Component
import { SearchComponent } from './search.component';

@NgModule({
    imports: [
        RouterModule.forChild(SearchRoutes),
        CommonModule
    ],
    declarations: [
        SearchComponent
    ],
    providers: []
})
export class SearchModule { }
