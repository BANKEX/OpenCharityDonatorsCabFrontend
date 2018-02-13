import { Component, Inject,  AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../services/http-service';
import 'rxjs/add/operator/takeWhile';

@Component({
  templateUrl: './forgot-pass-modal.component.html',
  styleUrls: ['./forgot-pass-modal.component.scss'],
  providers: [HttpService]
})
export class ForgotPassModal {

  public emailModel = '';

  private httpAlive: boolean = true;

  constructor (private httpService: HttpService, private thisDialogRef: MatDialogRef<ForgotPassModal>, @Inject(MAT_DIALOG_DATA) public data) {}


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
