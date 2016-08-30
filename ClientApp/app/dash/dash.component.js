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
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var DashComponent = (function () {
    function DashComponent(dashService, http) {
        this.dashService = dashService;
        this.http = http;
        this.OverallStatus = {};
        this.token = !window.localStorage['jwt'];
    }
    DashComponent.prototype.close = function () {
        this.modal.close();
        this.expandedMachine = null;
    };
    DashComponent.prototype.open = function () {
        this.modal.open();
    };
    DashComponent.prototype.auth = function () {
        var _this = this;
        this.dashService.startOAuthFlow(function () { _this.token = false; _this.ngOnInit(); });
    };
    DashComponent.prototype.deAuth = function () {
        this.dashService.jwt = undefined;
        delete window.localStorage['jwt'];
        this.token = true;
        location.reload();
    };
    DashComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getEnvironments().then(function (Envs) {
            _this.getAllData(Envs, _this.timeoutTheDetails.bind(_this, Envs));
        });
    };
    DashComponent.prototype.expandMachine = function (envname, machine) {
        this.getDetailedStatus(envname, machine);
        this.expandedMachine = machine;
        this.modal.open();
    };
    DashComponent.prototype.getAllData = function (Envs, Callback) {
        Promise.all(Envs.map(this.getOverallStatus.bind(this))).then(Callback);
    };
    DashComponent.prototype.timeoutTheDetails = function (Envs) {
        setTimeout(this.getAllData.bind(this, Envs, this.timeoutTheDetails.bind(this, Envs)), 10000);
    };
    // gets the state of every machine
    DashComponent.prototype.getOverallStatus = function (Environment) {
        var _this = this;
        return this.dashService.getOverallStatus(Environment).then(function (response) {
            var Expanded = _this.Environments[Environment].expanded;
            _this.OverallStatus[Environment] = response.json();
            _this.Environments[Environment]['state'] = _this.OverallStatus[Environment]['state'];
            _this.Environments[Environment].expanded = Expanded;
            function isExpanded(Env) {
                return this.Environments[Env].expanded;
            }
            var ExpandedEnvs = Object.keys(_this.Environments).filter(isExpanded.bind(_this));
            return ExpandedEnvs;
        }).then(function (Environments) {
            return Promise.all(Environments.map(_this.getStatusSummary.bind(_this)));
        });
    };
    // gets the basic info of every machine in the Environment
    DashComponent.prototype.getStatusSummary = function (Environment) {
        var _this = this;
        return this.dashService.getStatusSummary(Environment).then(function (response) {
            var Env = _this.Environments[Environment];
            //check and get DetailedStatus
            var Expanded = Env.summary ? Env.summary.map(function (m) { return m.expanded; }) : [];
            var Details = Env.summary ? Env.summary.map(function (m) { return m.details; }) : [];
            var Summary = response.json();
            for (var i in Expanded) {
                if (Summary[i] != undefined) {
                    Summary[i].expanded = Expanded[i];
                    Summary[i].details = Details[i];
                }
            }
            for (var Machine in Summary) {
                if (Expanded[Machine]) {
                }
            }
            function isExpanded(_, Machine) {
                return Expanded[Machine];
            }
            var ExpandedMachines = Summary.filter(isExpanded);
            if (ExpandedMachines.length) {
                _this.expandedMachine = ExpandedMachines[0];
            }
            Env.summary = Summary;
            return ExpandedMachines;
        }).then(function (ExpandedMachines) { return Promise.all(ExpandedMachines.map(_this.getDetailedStatus.bind(_this, Environment))); });
    };
    // gets a detailed info of a machine
    DashComponent.prototype.getDetailedStatus = function (Environment, Machine) {
        return this.dashService.getDetailedStatus(Environment, Machine.nid).then(function (response) {
            var Expanded = Machine.details ? Machine.details.map(function (m) { return m.expanded; }) : [];
            Machine.details = response.json();
            for (var i in Expanded) {
                Machine.details[i].expanded = Expanded[i];
            }
        });
    };
    DashComponent.prototype.getEnvironments = function () {
        var _this = this;
        return this.dashService.getEnvironments().then(function (response) {
            _this.Environments = response.json();
            _this.Environments2 = Object.keys(_this.Environments).map(function (name) { return _this.Environments[name]; });
            if (!_this.Environments2) {
                _this.Environments2.map(function (Env) { return Env.expanded = false; });
            }
            return _this.Environments2.map(function (Env) { return Env.name; });
        });
    };
    __decorate([
        core_1.ViewChild('modal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], DashComponent.prototype, "modal", void 0);
    DashComponent = __decorate([
        core_1.Component({
            selector: 'my-dash',
            templateUrl: 'app/dash/templates/page.html',
            providers: [dash_service_1.DashService, http_1.HTTP_PROVIDERS],
            directives: [ng2_bs3_modal_1.MODAL_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [dash_service_1.DashService, http_1.Http])
    ], DashComponent);
    return DashComponent;
}());
exports.DashComponent = DashComponent;
//# sourceMappingURL=dash.component.js.map