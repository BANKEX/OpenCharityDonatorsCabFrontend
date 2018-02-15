import { Component, Inject,  AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: './forgot-pass-modal.html',
  styleUrls: ['./forgot-pass-modal.scss'],
  providers: [HttpService]
})
export class ForgotPassModalComponent {

  public emailModel = '';

  private httpAlive: boolean = true;

  constructor (private httpService: HttpService, private thisDialogRef: MatDialogRef<ForgotPassModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {}


  ngOnDestroy() {
    this.httpAlive = false;
  }

  onCloseSuccess() {
    this.thisDialogRef.close(true);
  }

  onCloseCancel() {
    this.thisDialogRef.close(false);
  }

  passFormSubmit() {
    const data = {
      'email': this.emailModel
    }
      this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/user/forgot`, JSON.stringify(data))
        .takeWhile(() => this.httpAlive)
        .subscribe(
          response => {
            console.log(response);
            this.emailModel = '';
            this.thisDialogRef.close('success');
          },
          error => {
            this.thisDialogRef.close('error');
          });
    }

}
