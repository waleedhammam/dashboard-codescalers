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
  Environments;
  Environments2;
  
  OverallStatus: Object;
  StatusSummary: Object;
  // DetailedStatus;
  // HealthCheck;
  count = 0;
  id;
  
  constructor (private dashService: DashService, private http:Http) {
    
  }
  
  ngOnInit(){
    this.getEnvironments();

    this.id = setInterval(() => {

      // for (let env in this.Environments) {
      //  let environment =  this.getOverallStatus(env);
      //  environment['name'] = env;
      //  this.Environments
      // }
      // this.getStatusSummary();
      // this.getDetailedStatus();
      // this.getEnvironments();
      for (let env in this.Environments){
        if(this.Environments[env]['expanded'] == false){
          this.getStatusSummary(env);
        }
      }
    }, 1000);
  
    // this.getOverallStatus();
    // this.getStatusSummary();
    // this.getDetailedStatus();
  }

  getOverallStatus(environment) {
    this.dashService.getOverallStatus(environment, response => this.Environments[environment] = response.json());   
  }

  getStatusSummary(environment){
    this.dashService.getStatusSummary(environment, response => this.Environments[environment].summary = response.json());
    
  }

  // getHealthRun(){
  //   this.http.request('http://127.0.0.1:5000/getHealthRun?nid=' + this.nid_no2)
  //             .debounceTime(400)
  //             .distinctUntilChanged()
  //             .subscribe(response => this.HealthCheck = response.json());    

  // // }
  // getDetailedStatus(){
  //   this.http.request('http://127.0.0.1:5000/getDetailedStatus?nid=' + 2)
  //             .debounceTime(400)
  //             .distinctUntilChanged()
  //             .subscribe(response => this.DetailedStatus = response.json()); 
  
  // }
  getEnvironments(){
    this.dashService.getEnvironments(response => {
      this.Environments = response.json();
      this.Environments2 = Object.keys(this.Environments).map(name => this.Environments[name]);
    });
  }
}
