import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HttpService {

  constructor( private http: Http) {}

  httpGet(url: string) {
    const headers = new Headers();
    headers.append('content-type', 'application/json; charset=utf-8');
    const options = new RequestOptions({headers: headers});
    return this.http.get(url)
      .map(respose => respose.json() || '')
      .map(respose => {
        return respose;
      })
      .catch ((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
