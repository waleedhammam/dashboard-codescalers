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
        // HealthCheck;
        this.count = 0;
    }
    DashComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getEnvironments();
        this.id = setInterval(function () {
            // this.getEnvironments();
            // for (let env in this.Environments) {
            //  let environment =  this.getOverallStatus(env);
            //  environment['name'] = env;
            //  this.Environments
            // }
            // this.getStatusSummary();
            // this.getDetailedStatus();
            // this.getEnvironments();
            for (var env in _this.Environments) {
                if (_this.Environments[env]['expanded'] == true) {
                    _this.getStatusSummary(env);
                }
            }
        }, 1000);
        // this.getOverallStatus();
        // this.getStatusSummary();
        // this.getDetailedStatus();
    };
    DashComponent.prototype.getOverallStatus = function (environment) {
        var _this = this;
        this.dashService.getOverallStatus(environment, function (response) {
            var expanded = _this.Environments[environment].expanded;
            _this.Environments[environment] = response.json();
            _this.Environments[environment].expanded = expanded;
        });
    };
    DashComponent.prototype.getStatusSummary = function (environment) {
        var _this = this;
        this.dashService.getStatusSummary(environment, function (response) {
            var env = _this.Environments[environment];
            var expanded = env.summary ? env.summary.map(function (m) { return m.expanded; }) : [];
            var details = env.summary ? env.summary.map(function (m) { return m.details; }) : [];
            var summary = response.json();
            for (var i in expanded) {
                summary[i].expanded = expanded[i];
                summary[i].details = details[i];
            }
            for (var machine in summary) {
                if (expanded[machine]) {
                    _this.getDetailedStatus(environment, summary[machine]);
                }
            }
            env.summary = summary;
        });
    };
    // getHealthRun(){
    //   this.http.request('http://127.0.0.1:5000/getHealthRun?nid=' + this.nid_no2)
    //             .debounceTime(400)
    //             .distinctUntilChanged()
    //             .subscribe(response => this.HealthCheck = response.json());    
    // // }
    DashComponent.prototype.getDetailedStatus = function (environment, machine) {
        this.dashService.getDetailedStatus(environment, machine.nid, function (response) {
            //let env = this.Environments[environment]
            var expanded = machine.details ? machine.details.map(function (m) { return m.expanded; }) : [];
            machine.details = response.json();
            for (var i in expanded) {
                machine.details[i].expanded = expanded[i];
            }
        });
    };
    DashComponent.prototype.getEnvironments = function () {
        var _this = this;
        this.dashService.getEnvironments(function (response) {
            _this.Environments = response.json();
            if (!_this.Environments2) {
                _this.Environments2 = Object.keys(_this.Environments).map(function (name) { return _this.Environments[name]; });
            }
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
//# sourceMappingURL=dash.component.js.map