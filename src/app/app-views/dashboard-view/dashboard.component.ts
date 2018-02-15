import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../app-services/http.service';
import { SocketService } from '../../app-services/socket.service';
import 'rxjs/add/operator/takeWhile';


@Component({
    templateUrl: 'dashboard.component.html',
    providers: [HttpService]
})

export class DashboardComponent implements OnInit {

    private httpAlive = true;

    public incomingDonations = [];
    public charityEvents = [];

    constructor( private httpService: HttpService, private socketService: SocketService) {}

    ngOnInit() {
      this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations`);
      this.getCharityEvents(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents`);
    }

    getIncomingDonations(url) {
      this.httpService.getSocketData(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.getIncomingDonationsSockets(response['_body']);
            },
            error => {
              console.log(error);
            });
    }

    getIncomingDonationsSockets(id) {
      this.socketService.getData(id)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.incomingDonations.push(JSON.parse(response));
            },
            error => {
              console.log(error);
            });
    }

    getCharityEvents(url) {
      this.httpService.getSocketData(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.getCharityEventsSockets(response['_body']);
            },
            error => {
              console.log(error);
            });
    }

    getCharityEventsSockets(id) {
      this.socketService.getData(id)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.charityEvents.push(JSON.parse(response));
            },
            error => {
              console.log(error);
            });
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

}
