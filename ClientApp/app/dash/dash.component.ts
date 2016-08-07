import { Component, OnInit }        from '@angular/core';
import { HTTP_PROVIDERS, Http }  from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { DashService } from './dash.service';

@Component({
  selector: 'my-dash',
  templateUrl:'app/dash/templates/page.html' ,
  providers: [DashService, HTTP_PROVIDERS],
})

export class DashComponent implements OnInit {
  nid_no = '';
  nid_no2 = '';
  OverallStatus;
  StatusSummary;
  DetailedStatus;
  HealthCheck;
  count = 0;
  id;
  
  constructor (private dashService: DashService, private http:Http) {
  this.id = setInterval(() => {
      this.getOverallStatus();
      this.getStatusSummary();
      this.getDetailedStatus();
    }, 10000);
    
  }
  
  ngOnInit(){
    this.getOverallStatus();
    this.getStatusSummary();
    this.getDetailedStatus();
  }

  getOverallStatus() {
    this.dashService.getOverallStatus(response => this.OverallStatus = response.json());   
  }

  getStatusSummary(){
    this.dashService.getStatusSummary(response => this.StatusSummary = response.json());
    
  }

  getHealthRun(){
    this.http.request('http://127.0.0.1:5000/getHealthRun?nid=' + this.nid_no2)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(response => this.HealthCheck = response.json());    

  }
  getDetailedStatus(){
    this.http.request('http://127.0.0.1:5000/getDetailedStatus?nid=' + 2)
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(response => this.DetailedStatus = response.json()); 
  
  }

}
