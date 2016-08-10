import { Component, OnInit }        from '@angular/core';
import { HTTP_PROVIDERS }  from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { DashService } from './dash.service';

@Component({
  selector: 'my-dash',
  templateUrl: 'app/dash/templates/page.html',
  providers: [DashService, HTTP_PROVIDERS],
})

export class DashComponent implements OnInit {
  Environments;
  Environments2;

  OverallStatus: Object;
  StatusSummary: Object;
  timer;

  constructor(private dashService: DashService) { }

  get_data(callback) {

    for (let env in this.Environments) {
      if (this.Environments[env]['expanded'] == true) {
        this.getStatusSummary(env);
      }
    }
    setTimeout(() => {
      callback()
    }, 1500)
  }
  call() {
    setTimeout(() => this.get_data(this.call.bind(this)), 1500);
  }

  ngOnInit() {
    this.getEnvironments();
    this.getOverallStatus(this.callback.bind(this));
    this.get_data(this.call.bind(this));
  }

  getEnvironments() {

    this.dashService.getEnvironments(response => {
      this.Environments = response.json();
      if (!this.Environments2) {
        this.Environments2 = Object.keys(this.Environments).map(name => this.Environments[name]);
      }
    });
  }

  getOverallStatus(callback) {
    for (let env in this.Environments) {
      this.dashService.getOverallStatus(env, response => {
        let expanded = this.Environments[env].expanded
        this.Environments[env].status_summary = response.json()
        this.Environments[env].expanded = expanded
      });
    }
    setTimeout(() => {
      callback()
    }, 10000)
  }
  callback() {
    setTimeout(() => this.getOverallStatus(this.callback.bind(this)), 10000);
  }

  getStatusSummary(environment) {
    this.dashService.getStatusSummary(environment, response => {
      let env = this.Environments[environment]
      let expanded = env.summary ? env.summary.map(m => m.expanded) : [];
      let details = env.summary ? env.summary.map(m => m.details) : [];
      let summary = response.json()

      for (let i in expanded) {
        summary[i].expanded = expanded[i]
        summary[i].details = details[i]
      }
      for (let machine in summary) {
        if (expanded[machine]) {
          this.getDetailedStatus(environment, summary[machine])
        }
      }
      env.summary = summary
    });
  }

  getDetailedStatus(environment, machine) {
    this.dashService.getDetailedStatus(environment, machine.nid, response => {

      let expanded = machine.details ? machine.details.map(m => m.expanded) : [];
      machine.details = response.json();

      for (let i in expanded) {
        machine.details[i].expanded = expanded[i]
      }
    });
  }
}
