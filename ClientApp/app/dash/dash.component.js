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
        var _this = this;
        this.dashService = dashService;
        this.http = http;
        this.nid_no = '';
        this.nid_no2 = '';
        this.count = 0;
        this.id = setInterval(function () {
            _this.getOverallStatus();
            _this.getStatusSummary();
        }, 10000);
    }
    DashComponent.prototype.ngOnInit = function () {
        this.getOverallStatus();
        this.getStatusSummary();
    };
    DashComponent.prototype.getOverallStatus = function () {
        var _this = this;
        this.dashService.getOverallStatus(function (response) { return _this.OverallStatus = response.json(); });
    };
    DashComponent.prototype.getStatusSummary = function () {
        var _this = this;
        this.dashService.getStatusSummary(function (response) { return _this.StatusSummary = response.json(); });
    };
    DashComponent.prototype.getHealthRun = function () {
        var _this = this;
        this.http.request('http://127.0.0.1:5000/getHealthRun?nid_no=' + this.nid_no2)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(function (response) { return _this.HealthCheck = response.json(); });
    };
    DashComponent.prototype.getDetailedStatus = function () {
        var _this = this;
        this.http.request('http://127.0.0.1:5000/getDetailedStatus?nid_no=' + this.nid_no)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(function (response) { return _this.DetailedStatus = response.json(); });
    };
    DashComponent = __decorate([
        core_1.Component({
            selector: 'my-dash',
            templateUrl: 'app/dash/templates/page.html',
            providers: [dash_service_1.DashService, http_1.HTTP_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [dash_service_1.DashService, http_1.Http])
    ], DashComponent);
    return DashComponent;
}());
exports.DashComponent = DashComponent;
//# sourceMappingURL=dash.component.js.map