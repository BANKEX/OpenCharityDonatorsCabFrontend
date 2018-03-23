import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './alert-modal.html',
  styleUrls: ['./alert-modal.scss']
})
export class AlertModalComponent {

	constructor (private thisDialogRef: MatDialogRef<AlertModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

	onCloseSuccess() {
		this.thisDialogRef.close(true);
	}

	onCloseCancel() {
		this.thisDialogRef.close(false);
	}
}
