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
  nid = '';
  Environments;
  Environments2;
  
  OverallStatus: Object;
  StatusSummary: Object;
  DetailedStatus;
  // HealthCheck;
  count = 0;
  id;
  
  constructor (private dashService: DashService, private http:Http) {
    
  }
  
  ngOnInit(){
    this.getEnvironments();

    this.id = setInterval(() => {
    // this.getEnvironments();

      // for (let env in this.Environments) {
      //  let environment =  this.getOverallStatus(env);
      //  environment['name'] = env;
      //  this.Environments
      // }
      // this.getStatusSummary();
      // this.getDetailedStatus();
      // this.getEnvironments();
      for (let env in this.Environments){
        if(this.Environments[env]['expanded'] == true){
          this.getStatusSummary(env);
        }
      }
    }, 5000);
  
    // this.getOverallStatus();
    // this.getStatusSummary();
    // this.getDetailedStatus();
  }

  getOverallStatus(environment) {
    this.dashService.getOverallStatus(environment, response => {
      let expanded = this.Environments[environment].expanded 
      this.Environments[environment] = response.json()
      this.Environments[environment].expanded = expanded
    });   
  }

  getStatusSummary(environment){
    this.dashService.getStatusSummary(environment, response => {
      let env = this.Environments[environment]
      let expanded = env.summary?env.summary.map(m => m.expanded):[];
      let details = env.summary?env.summary.map(m => m.details):[];
      let summary = response.json()

      for (let i in expanded) {
          summary[i].expanded = expanded[i]
          summary[i].details = details[i]
      }
      for(let machine in summary){
         if (expanded[machine]){
          this.getDetailedStatus(environment,summary[machine])
         }

      }
      env.summary = summary
    });
    
  }

  // getHealthRun(){
  //   this.http.request('http://127.0.0.1:5000/getHealthRun?nid=' + this.nid_no2)
  //             .debounceTime(400)
  //             .distinctUntilChanged()
  //             .subscribe(response => this.HealthCheck = response.json());    

  // // }

  getDetailedStatus(environment, machine){
     this.dashService.getDetailedStatus(environment, machine.nid, response => {

        //let env = this.Environments[environment]
        let expanded = machine.details?machine.details.map(m => m.expanded):[];
        machine.details = response.json();

      for (let i in expanded) {
          machine.details[i].expanded = expanded[i]
      }
      }); 
    
  
  }
  getEnvironments(){
    this.dashService.getEnvironments(response => {
      this.Environments = response.json();
      if(! this.Environments2){
      this.Environments2 = Object.keys(this.Environments).map(name => this.Environments[name]);
      }
    });
  }
}
