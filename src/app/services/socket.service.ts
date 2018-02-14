import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

export class SocketService {
    private url = 'http://127.0.0.1:8080';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public getData = (data) => {
      return Observable.create((observer) => {
          this.socket.on(data, (dataArr) => {
              observer.next(dataArr);
          });
      });
   }

}
