import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HttpService {

  public baseAPIurl = 'https://donatorscab.staging.bankex.team';

  constructor( private http: Http) {}

  httpGet(url: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
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

}
