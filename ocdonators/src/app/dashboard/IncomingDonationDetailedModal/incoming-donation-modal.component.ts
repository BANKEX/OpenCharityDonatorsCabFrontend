import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './incoming-donation-modal.component.html',
  styleUrls: ['./incoming-donation-modal.component.scss']
})
export class IncomingDonationDetailedModal {

  constructor (private thisDialogRef: MatDialogRef<IncomingDonationDetailedModal>, @Inject(MAT_DIALOG_DATA) public data) {}

  onCloseSuccess() {
    this.thisDialogRef.close(true);
  }

  onCloseCancel() {
    this.thisDialogRef.close(false);
  }

}
