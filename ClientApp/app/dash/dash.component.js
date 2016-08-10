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
    function DashComponent(dashService) {
        this.dashService = dashService;
    }
    DashComponent.prototype.get_data = function (callback) {
        for (var env in this.Environments) {
            if (this.Environments[env]['expanded'] == true) {
                this.getStatusSummary(env);
            }
        }
        setTimeout(function () {
            callback();
        }, 1500);
    };
    DashComponent.prototype.call = function () {
        var _this = this;
        setTimeout(function () { return _this.get_data(_this.call.bind(_this)); }, 1500);
    };
    DashComponent.prototype.ngOnInit = function () {
        this.getEnvironments();
        this.getOverallStatus(this.callback.bind(this));
        this.get_data(this.call.bind(this));
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
    DashComponent.prototype.getOverallStatus = function (callback) {
        var _this = this;
        var _loop_1 = function(env) {
            this_1.dashService.getOverallStatus(env, function (response) {
                var expanded = _this.Environments[env].expanded;
                _this.Environments[env].status_summary = response.json();
                _this.Environments[env].expanded = expanded;
            });
        };
        var this_1 = this;
        for (var env in this.Environments) {
            _loop_1(env);
        }
        setTimeout(function () {
            callback();
        }, 10000);
    };
    DashComponent.prototype.callback = function () {
        var _this = this;
        setTimeout(function () { return _this.getOverallStatus(_this.callback.bind(_this)); }, 10000);
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
    DashComponent.prototype.getDetailedStatus = function (environment, machine) {
        this.dashService.getDetailedStatus(environment, machine.nid, function (response) {
            var expanded = machine.details ? machine.details.map(function (m) { return m.expanded; }) : [];
            machine.details = response.json();
            for (var i in expanded) {
                machine.details[i].expanded = expanded[i];
            }
        });
    };
    DashComponent = __decorate([
        core_1.Component({
            selector: 'my-dash',
            templateUrl: 'app/dash/templates/page.html',
            providers: [dash_service_1.DashService, http_1.HTTP_PROVIDERS],
        }), 
        __metadata('design:paramtypes', [dash_service_1.DashService])
    ], DashComponent);
    return DashComponent;
}());
exports.DashComponent = DashComponent;
//# sourceMappingURL=dash.component.js.map