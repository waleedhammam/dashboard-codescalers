"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var dash_service_1 = require('./dash.service');
var DashComponent = (function () {
    function DashComponent(dashService, http) {
        this.dashService = dashService;
        this.http = http;
        this.nid = '';
        this.OverallStatus = {};
        this.data_arrived = true;
    }
    DashComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getEnvironments().then(function (envs) {
            console.log("typeof(envs)==========> " + typeof (envs));
            _this.getAllData(envs, _this.timeoutTheDetails.bind(_this, envs));
        });
        // this.id = setInterval(() => {
        //   // for (let env in this.Environments){
        //   //   this.getOverallStatus(env);
        //   //   if(this.Environments[env]['expanded'] == true){
        //   //     this.getStatusSummary(env);
        //   //   }
        //   // }
        // }, 1000);
    };
    DashComponent.prototype.getAllData = function (envs, callback) {
        console.log("envs=> " + envs);
        console.log("callback => " + callback);
        Promise.all(envs.map(this.getOverallStatus.bind(this))).then(callback);
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
    };
    DashComponent.prototype.timeoutTheDetails = function (envs) {
        setTimeout(this.getAllData.bind(this, envs, this.timeoutTheDetails.bind(this, envs)), 1000);
    };
    // gets the state of every machine        
    DashComponent.prototype.getOverallStatus = function (environment) {
        var _this = this;
        console.log("environment ====>" + environment);
        // console.log(".map(x => x.namehere!")
        // console.log(environment)
        return this.dashService.getOverallStatus(environment).then(function (response) {
            // console.log("this", this)
            var expanded = _this.Environments[environment].expanded;
            console.log("Enironments Expanded " + expanded);
            _this.OverallStatus[environment] = response.json();
            _this.Environments[environment]['state'] = _this.OverallStatus[environment]['state'];
            _this.Environments[environment].expanded = expanded;
            // console.log(this.Environments[environment])
            // console.log("--------")
            // console.log(expanded)
            function is_expanded(env) {
                return this.Environments[env].expanded;
            }
            console.log("keys=>>>>" + Object.keys(_this.Environments));
            return Object.keys(_this.Environments);
        }).then(function (environments) {
            return Promise.all(environments.map(_this.getStatusSummary.bind(_this)));
        });
    };
    // gets the basic info of every machine in the environment
    DashComponent.prototype.getStatusSummary = function (environment) {
        var _this = this;
        return this.dashService.getStatusSummary(environment).then(function (response) {
            var env = _this.Environments[environment];
            //check and get DetailedStatus
            console.log("env " + env.summary);
            var expanded = env.summary ? env.summary.map(function (m) { return m.expanded; }) : [];
            console.log("expanded " + expanded);
            var details = env.summary ? env.summary.map(function (m) { return m.details; }) : [];
            var summary = response.json();
            for (var i in expanded) {
                summary[i].expanded = expanded[i];
                summary[i].details = details[i];
            }
            for (var machine in summary) {
                console.log(expanded[machine]);
                if (expanded[machine]) {
                    console.log("the summary oif machines" + summary[machine]);
                }
            }
            function is_expanded(_, machine) {
                return expanded[machine];
            }
            var expanded_machines = summary.filter(is_expanded);
            console.log(expanded_machines);
            env.summary = summary;
            return expanded_machines;
        }).then(function (expanded_machines) { return Promise.all(expanded_machines.map(_this.getDetailedStatus.bind(_this, environment))); });
    };
    // gets a detailed info of a machine
    DashComponent.prototype.getDetailedStatus = function (environment, machine) {
        console.log("I'm IN DETAILED");
        return this.dashService.getDetailedStatus(environment, machine.nid).then(function (response) {
            var expanded = machine.details ? machine.details.map(function (m) { return m.expanded; }) : [];
            machine.details = response.json();
            for (var i in expanded) {
                machine.details[i].expanded = expanded[i];
            }
        });
    };
    DashComponent.prototype.getEnvironments = function () {
        var _this = this;
        return this.dashService.getEnvironments().then(function (response) {
            _this.Environments = response.json();
            if (!_this.Environments2) {
                _this.Environments2 = Object.keys(_this.Environments).map(function (name) { return _this.Environments[name]; });
                _this.Environments2.map(function (env) { return env.expanded = false; });
            }
            return _this.Environments2.map(function (env) { return env.name; });
        });
    };
    DashComponent = __decorate([
        core_1.Component({
            selector: 'my-dash',
            templateUrl: 'app/dash/templates/page.html',
            providers: [dash_service_1.DashService, http_1.HTTP_PROVIDERS],
        }), 
        __metadata('design:paramtypes', [dash_service_1.DashService, http_1.Http])
    ], DashComponent);
    return DashComponent;
}());
exports.DashComponent = DashComponent;
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
//# sourceMappingURL=dash.component.js.map