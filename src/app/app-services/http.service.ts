import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app-config/app.config';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpService {

  public baseAPIurl = AppConfig.API_URL;

  constructor( private http: Http, private cookieService: CookieService) {}

  httpGet(url: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.cookieService.get('userData')}`);
    const options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(respose => respose.json() || '')
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  httpPost(url: string, data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options)
      .map(respose => respose.json() || '')
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getUserData() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this.http.get(`${this.baseAPIurl}/api/user/?jwt=${this.cookieService.get('userData')}`, options)
      .map(respose => respose.json() || '')
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  updateUserData(data) {
    const headers = new Headers();
    headers.append('Authorization', `${this.cookieService.get('userData')}`);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this.http.post(`${this.baseAPIurl}/api/user/change`, JSON.stringify(data), options)
      .map(respose => respose.json() || '')
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getSocketData(url: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  logOutUser(url) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.cookieService.get('userData')}`);
    const options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
