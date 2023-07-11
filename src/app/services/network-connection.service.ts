import { Injectable } from '@angular/core';
import { fromEvent, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionService {
  private _status = true;

  get status(){
    return this._status;
  }

  set status(value){
    this._status = value;
  }

  constructor() { }

  observeConnection(){
    fromEvent(window, 'offline')
      .pipe( debounceTime(100) )
      .subscribe(() => {
        this.status = false;
      })

    fromEvent(window, 'online')
      .pipe( debounceTime(100) )
      .subscribe(() => {
        this.status = true;
      })
  }
}
