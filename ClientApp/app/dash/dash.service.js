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
var DashService = (function () {
    function DashService(http) {
        this.http = http;
    }
    DashService.prototype.getStatusSummary = function (environment, callback) {
        var dashUrl = '/getStatusSummary?environment=' + environment;
        this.http.request(dashUrl)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(callback);
    };
    DashService.prototype.getOverallStatus = function (environment, callback) {
        var dashUrl = '/getOverallStatus?environment=' + environment;
        this.http.request(dashUrl)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(callback);
    };
    DashService.prototype.getDetailedStatus = function (envionment, nid, callback) {
        var dashUrl = '/getDetailedStatus?environment=' + envionment + '&nid=' + nid;
        this.http.request(dashUrl)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(callback);
    };
    DashService.prototype.getEnvironments = function (callback) {
        var dashUrl = '/environments';
        this.http.request(dashUrl)
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(callback);
    };
    DashService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DashService);
    return DashService;
}());
exports.DashService = DashService;
//# sourceMappingURL=dash.service.js.map