import { Injectable }     from '@angular/core';
import { Http }           from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { DashComponent }  from './dash.component';

@Injectable()
export class DashService {
  constructor(private http:Http) {}
  getStatusSummary (environment) {

    let dashUrl = '/getStatusSummary?environment=' + environment;
    return this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .toPromise();
  }
  getOverallStatus(environment) {

    let dashUrl = '/getOverallStatus?environment=' + environment;
    return this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .toPromise()
              

  }
  getDetailedStatus(envionment, nid) {

    let dashUrl = '/getDetailedStatus?environment='+ envionment + '&nid=' + nid;
    
    return this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .toPromise();

  }

  getEnvironments() {

    let dashUrl = '/environments';
    
    return this.http.request(dashUrl)
              .debounceTime(400)
              .distinctUntilChanged()
              .toPromise()

  }
}

