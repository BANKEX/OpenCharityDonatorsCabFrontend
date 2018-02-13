import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

// Directives
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Routing Module
import { AppRoutes } from './app.routing';

// App Component
import { AppComponent } from './app.component';

import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Incoming Donation Modal
import { IncomingDonationDetailedModal } from './dashboard/IncomingDonationDetailedModal/incoming-donation-modal.component';

// App modals
import { AlertModal } from './modals/alert-modal/alert-modal.component';
import { ForgotPassModal } from './modals/forgot-pass-modal/forgot-pass-modal.component';

import { GuardService } from './services/guard-service';
import { UserService } from './services/user-service';
import { CookieService } from 'ngx-cookie-service';

import 'hammerjs';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(AppRoutes, { useHash: true }),
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        HttpModule,
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        AuthenticationLayoutComponent,
        IncomingDonationDetailedModal,
        AlertModal,
        ForgotPassModal
    ],
    entryComponents: [
      IncomingDonationDetailedModal,
      AlertModal,
      ForgotPassModal
    ],
    providers: [GuardService, UserService, CookieService],
    bootstrap: [AppComponent]
})


export class AppModule { }
