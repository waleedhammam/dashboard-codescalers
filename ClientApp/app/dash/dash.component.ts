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
  Nid = '';
  Environments;
  Environments2;
  OverallStatus = {};
  StatusSummary: Object;
  DetailedStatus;
  Id;

  constructor(private dashService: DashService, private http: Http) {

  }

  ngOnInit() {
    this.getEnvironments().then((Envs) =>{
        this.getAllData(Envs,this.timeoutTheDetails.bind(this,Envs))
   });


  }

  getAllData(Envs,Callback) {

    Promise.all(Envs.map(this.getOverallStatus.bind(this))).then(Callback)

  
}


  timeoutTheDetails(Envs) {
    setTimeout(this.getAllData.bind(this,Envs, this.timeoutTheDetails.bind(this, Envs)), 10000);
  }

  // gets the state of every machine        
  getOverallStatus(Environment) {

    return this.dashService.getOverallStatus(Environment).then(
      (response) => {
        let Expanded = this.Environments[Environment].expanded
        this.OverallStatus[Environment] = response.json()
        this.Environments[Environment]['state'] = this.OverallStatus[Environment]['state']
        this.Environments[Environment].expanded = Expanded
        function isExpanded(Env) {
          return this.Environments[Env].expanded
        }
        let ExpandedEnvs = Object.keys(this.Environments).filter(isExpanded.bind(this))
        
        return ExpandedEnvs
      }
    ).then((Environments) => {
      return Promise.all(Environments.map(this.getStatusSummary.bind(this)))
    })

  }

  // gets the basic info of every machine in the Environment
  getStatusSummary(Environment) {
    return this.dashService.getStatusSummary(Environment).then((response) => {
      let Env = this.Environments[Environment]
      //check and get DetailedStatus
      let Expanded = Env.summary ? Env.summary.map(m => m.expanded) : [];
      let Details = Env.summary ? Env.summary.map(m => m.details) : [];
      let Summary = response.json();

      for (let i in Expanded) {
        if (Summary[i] != undefined){
        Summary[i].expanded = Expanded[i]
        Summary[i].details = Details[i]
        }
      }

      for (let Machine in Summary) {
        if (Expanded[Machine]) {
        }
      }

      function isExpanded(_, Machine) {
        return Expanded[Machine]
      }

      let ExpandedMachines = Summary.filter(isExpanded)
      Env.summary = Summary
      return ExpandedMachines
    }).then((ExpandedMachines) => { return Promise.all(ExpandedMachines.map(this.getDetailedStatus.bind(this, Environment))) });
  }

  // gets a detailed info of a machine
  getDetailedStatus(Environment, Machine) {
    return this.dashService.getDetailedStatus(Environment, Machine.nid).then((response) => {
      let Expanded = Machine.details ? Machine.details.map(m => m.expanded) : [];
      Machine.details = response.json();

      for (let i in Expanded) {
        Machine.details[i].expanded = Expanded[i]
      }
    });
  }

  getEnvironments() {
    return this.dashService.getEnvironments().then((response) => {
      this.Environments = response.json();
      if (!this.Environments2) {
        this.Environments2 = Object.keys(this.Environments).map(name => this.Environments[name]);
        this.Environments2.map(Env => Env.expanded = false)
      }

     return this.Environments2.map(Env => Env.name)
    })
  }

}

