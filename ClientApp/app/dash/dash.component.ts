import { Component, OnInit }        from '@angular/core';
import { HTTP_PROVIDERS, Http }  from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { DashService } from './dash.service';

@Component({
  selector: 'my-dash',
  templateUrl: 'app/dash/templates/page.html',
  providers: [DashService, HTTP_PROVIDERS],
})

export class DashComponent implements OnInit {
  nid = '';
  Environments;
  Environments2;
  OverallStatus = {};
  StatusSummary: Object;
  DetailedStatus;
  data_arrived = true;
  id;

  constructor(private dashService: DashService, private http: Http) {

  }

  ngOnInit() {
    this.getEnvironments().then((envs) =>{
        this.getAllData(envs,this.timeoutTheDetails.bind(this,envs))
   });


  }

  getAllData(envs,callback) {

    Promise.all(envs.map(this.getOverallStatus.bind(this))).then(callback)

  
}


  timeoutTheDetails(envs) {
    setTimeout(this.getAllData.bind(this,envs, this.timeoutTheDetails.bind(this, envs)), 3000);
  }

  // gets the state of every machine        
  getOverallStatus(environment) {

    return this.dashService.getOverallStatus(environment).then(
      (response) => {
        let expanded = this.Environments[environment].expanded
        this.OverallStatus[environment] = response.json()
        this.Environments[environment]['state'] = this.OverallStatus[environment]['state']
        this.Environments[environment].expanded = expanded
        function is_expanded(env) {
          return this.Environments[env].expanded
        }
        let expanded_envs = Object.keys(this.Environments).filter(is_expanded.bind(this))
        
        return expanded_envs
      }
    ).then((environments) => {
      return Promise.all(environments.map(this.getStatusSummary.bind(this)))
    })

  }

  // gets the basic info of every machine in the environment
  getStatusSummary(environment) {
    return this.dashService.getStatusSummary(environment).then((response) => {
      let env = this.Environments[environment]
      //check and get DetailedStatus
      let expanded = env.summary ? env.summary.map(m => m.expanded) : [];
      let details = env.summary ? env.summary.map(m => m.details) : [];
      let summary = response.json();

      for (let i in expanded) {
        if (summary[i] != undefined){
        summary[i].expanded = expanded[i]
        summary[i].details = details[i]
        }
      }

      for (let machine in summary) {
        if (expanded[machine]) {
        }
      }

      function is_expanded(_, machine) {
        return expanded[machine]
      }

      let expanded_machines = summary.filter(is_expanded)
      env.summary = summary
      return expanded_machines
    }).then((expanded_machines) => { return Promise.all(expanded_machines.map(this.getDetailedStatus.bind(this, environment))) });
  }

  // gets a detailed info of a machine
  getDetailedStatus(environment, machine) {
    return this.dashService.getDetailedStatus(environment, machine.nid).then((response) => {
      let expanded = machine.details ? machine.details.map(m => m.expanded) : [];
      machine.details = response.json();

      for (let i in expanded) {
        machine.details[i].expanded = expanded[i]
      }
    });
  }

  getEnvironments() {
    return this.dashService.getEnvironments().then((response) => {
      this.Environments = response.json();
      if (!this.Environments2) {
        this.Environments2 = Object.keys(this.Environments).map(name => this.Environments[name]);
        this.Environments2.map(env => env.expanded = false)
      }

     return this.Environments2.map(env => env.name)
    })
  }

}

