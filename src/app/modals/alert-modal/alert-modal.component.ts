import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModal {

  constructor (private thisDialogRef: MatDialogRef<AlertModal>, @Inject(MAT_DIALOG_DATA) public data) {}

  onCloseSuccess() {
    this.thisDialogRef.close(true);
  }

  onCloseCancel() {
    this.thisDialogRef.close(false);
  }

}
