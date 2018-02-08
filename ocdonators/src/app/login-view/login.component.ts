// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../httpService/http-service';
import 'rxjs/add/operator/takeWhile';

import { matchingFileds } from '../components/validators/validators';
import { AlertModal } from '../modals/alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';


@Component({
    templateUrl: 'login.html',
    providers: [HttpService]
})

export class LoginComponent implements OnInit {

    private httpAlive: boolean = true;

    constructor( private httpService: HttpService) {}

    ngOnInit(){

    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

}
