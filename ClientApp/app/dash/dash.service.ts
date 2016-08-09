import { Injectable }     from '@angular/core';
import { Http }           from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { DashComponent }  from './dash.component';

@Injectable()
export class DashService {
  constructor(private http:Http) {}
  result;
  getStatusSummary (environment,callback) {

    let dashUrl = '/getStatusSummary?environment=' + environment;
    this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(callback);
  }
  getOverallStatus(environment, callback) {

    let dashUrl = '/getOverallStatus?environment=' + environment;
    this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(callback);

  }
  getDetailedStatus(envionment, nid, callback) {

    let dashUrl = '/getDetailedStatus?environment='+ envionment + '&nid=' + nid;
    
    this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(callback);

  }
  getHealthRun(callback) {

    let dashUrl = '/getHealthRun';
    
    this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(callback);

  }
  getEnvironments(callback) {

    let dashUrl = '/environments';
    
    this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(callback);

  }
}

