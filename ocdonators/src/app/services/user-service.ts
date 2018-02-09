import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

 public userData: object = {
  id: '',
  userRole: 'UNAUTHORIZED'
 }

 constructor(private cookieService: CookieService, private router: Router) {}

 setUserData(token) {
  let tokenData = token.split('.');
  tokenData = JSON.parse(atob(tokenData[1]));
  // Get cookie expired
  let tokenExp = new Date(tokenData.exp * 1000);
  // Set User info to cookie
  this.cookieService.set('userData', token, tokenExp, '/');

  this.setUserDataLocal('login');
 }

 getUserDataLocal() {
  if (this.cookieService.get('userData') != undefined && this.cookieService.get('userData') !== '') {
    return JSON.parse(atob(this.cookieService.get('userData').split('.')[1]));
   } else {
    return '';
   }
 }

 setUserDataLocal(data) {
   if(this.cookieService.check('userData')) {
    this.userData['id'] = this.getUserDataLocal()['_id'];
    this.userData['userRole'] = 'USER';
    if (data == 'login') {
      this.router.navigate(['/dashboard']);
    }
   }
 }

 removeUserDataLocal() {
  this.userData['id'] = '';
  this.userData['userRole'] = 'UNAUTHORIZED';
  this.cookieService.delete('userData', '/');
 }

}
