// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from './httpService/http-service';
import 'rxjs/add/operator/takeWhile';


@Component({
    templateUrl: 'dashboard.html',
    providers: [HttpService]
})

export class DashboardComponent implements OnInit {

    private httpAlive: boolean = true;
    public incomingDonations = [];

    constructor( private httpService: HttpService) {}

    ngOnInit(){
      this.getIncomingDonations('http://localhost:8080/api/dapp/getIncomingDonations');
    }

    getIncomingDonations(url) {
      this.httpService.httpGet(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.incomingDonations = response.data;
            },
            error => {
              console.log(error);
            });
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

}
