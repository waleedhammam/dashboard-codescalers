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
      console.log("typeof(envs)==========> " + typeof(envs))
        this.getAllData(envs,this.timeoutTheDetails.bind(this,envs))
   });

    // this.id = setInterval(() => {

    //   // for (let env in this.Environments){
    //   //   this.getOverallStatus(env);
    //   //   if(this.Environments[env]['expanded'] == true){
    //   //     this.getStatusSummary(env);
    //   //   }
    //   // }
    // }, 1000);


  }

  getAllData(envs,callback) {
    console.log("envs=> "+ envs)
    console.log("callback => " +callback)
    Promise.all(envs.map(this.getOverallStatus.bind(this))).then(callback)
   
    //     console.log("going in allData")
    //     let all_promises ;
    //     for (let env in this.Environments) {
    //       all_promises[env] =  this.getOverallStatus(env).then(() => {
    //         if (this.Environments[env]['expanded']) {
    //           return this.getStatusSummary(env);
    //         }
    // });
    // return all_promises.toPromise();
    //     }
  
}


  timeoutTheDetails(envs) {
    setTimeout(this.getAllData.bind(this,envs, this.timeoutTheDetails.bind(this, envs)), 1000);
  }

  // gets the state of every machine        
  getOverallStatus(environment) {
    console.log("environment ====>" + environment)
    // console.log(".map(x => x.namehere!")
    // console.log(environment)
    return this.dashService.getOverallStatus(environment).then(
      (response) => {
        // console.log("this", this)
        let expanded = this.Environments[environment].expanded
        console.log("Enironments Expanded " + expanded)
        this.OverallStatus[environment] = response.json()
        this.Environments[environment]['state'] = this.OverallStatus[environment]['state']
        this.Environments[environment].expanded = expanded
        // console.log(this.Environments[environment])
        // console.log("--------")
        // console.log(expanded)
        function is_expanded(env) {
          return this.Environments[env].expanded
        }
        console.log("keys=>>>>" + Object.keys(this.Environments))
        return Object.keys(this.Environments)
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
      console.log("env " + env.summary)
      let expanded = env.summary ? env.summary.map(m => m.expanded) : [];
      console.log("expanded " + expanded)
      let details = env.summary ? env.summary.map(m => m.details) : [];
      let summary = response.json();

      for (let i in expanded) {
        summary[i].expanded = expanded[i]
        summary[i].details = details[i]
      }

      for (let machine in summary) {
        console.log(expanded[machine])
        if (expanded[machine]) {
          console.log("the summary oif machines" + summary[machine])
        }
      }

      function is_expanded(_, machine) {
        return expanded[machine]
      }

      let expanded_machines = summary.filter(is_expanded)
      console.log(expanded_machines)
      env.summary = summary
      return expanded_machines
    }).then((expanded_machines) => { return Promise.all(expanded_machines.map(this.getDetailedStatus.bind(this, environment))) });
  }

  // gets a detailed info of a machine
  getDetailedStatus(environment, machine) {
    console.log("I'm IN DETAILED")
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


// getEverything(){
//   return dash.getEverything().then( (value) => {
//     saveEverything(value)
//     return environments
//   }).map(this.getEnvironment)
// }
// getEnvironment(environment){
//   return dash.getEnvironment(environment).then( (value) => {
//     saveEnvironment(environment, value)
//     return environment.machines
//   }).map(this.getMachine)
// }
// getMachine(machine){
//   return dash.getMachine(machine).then( (value) => {
//     saveMachine(machine, value)
//     return machine.services
//   }).map(this.getService)
// }
// getService(service){
//   return dash.getService(service).then( (value) => {
//     saveService(service, value)
//     return service.component
//   }).map(this.getComponent)
// }

// .then(() => {
//   return environments
// }).then((Environments) => {
//   return Promise.all(environments.map(this.getEnvironment))
// })

// function x(){
//   return setTimeout(x.bind(null, callback), 1000)
// }
// getEverything.then(setTimeout)