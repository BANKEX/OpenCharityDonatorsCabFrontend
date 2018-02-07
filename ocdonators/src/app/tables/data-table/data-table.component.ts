import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IncomingDonationDetailedModal } from '../../dashboard/IncomingDonationDetailedModal/incoming-donation-modal.component';
import { HttpService } from '../../dashboard/httpService/http-service';
import 'rxjs/add/operator/takeWhile';

@Component ({
    selector: 'app-data-table',
    templateUrl: 'data-table.html'
})
export class DataTableComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    private httpAlive: boolean = true;

    @Input() data;

    constructor(private dialog: MatDialog, private httpService: HttpService) {}

    ngOnInit(): void {
        this.dtOptions = {
            pagingType: 'full_numbers'
        };
    }

    openDetailedtIncomingDonation(hash) {
      this.httpService.httpGet(`http://localhost:8080/api/dapp/getIncomingDonation/${hash}`)
        .takeWhile(() => this.httpAlive)
        .subscribe(
          response => {
            this.openDetailedModal(response.data);
          },
          error => {
            console.log(error);
          });
    }

    openDetailedModal(data) {
      const dialogRef = this.dialog.open(IncomingDonationDetailedModal, {data: data});
      dialogRef.afterClosed()
        .takeWhile(() => this.httpAlive)
        .subscribe(result => {
          //console.log(result);
        })
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }
}
