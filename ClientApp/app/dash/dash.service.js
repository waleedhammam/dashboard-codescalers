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
        // save auth token
        this.jwt = window.localStorage['jwt'];
    }
    DashService.prototype.startOAuthFlow = function (callback) {
        var _this = this;
        var options = 'left=100,top=10,width=400,height=500';
        var oauth = window.open('/connect-auth', null, options);
        var x = function (jwt) {
            _this.jwt = jwt;
            window.localStorage['jwt'] = jwt;
            callback();
        };
        window['setJWT'] = x.bind(this);
    };
    DashService.prototype.getStatusSummary = function (environment) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'token ' + this.jwt);
        var dashUrl = '/getStatusSummary?environment=' + environment;
        return this.http.request(dashUrl, { headers: headers })
            .debounceTime(400)
            .distinctUntilChanged()
            .toPromise();
    };
    DashService.prototype.getOverallStatus = function (environment) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'token ' + this.jwt);
        var dashUrl = '/getOverallStatus?environment=' + environment;
        return this.http.request(dashUrl, { headers: headers })
            .debounceTime(400)
            .distinctUntilChanged()
            .toPromise();
    };
    DashService.prototype.getDetailedStatus = function (envionment, nid) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'token ' + this.jwt);
        var dashUrl = '/getDetailedStatus?environment=' + envionment + '&nid=' + nid;
        return this.http.request(dashUrl, { headers: headers })
            .debounceTime(400)
            .distinctUntilChanged()
            .toPromise();
    };
    DashService.prototype.getEnvironments = function () {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'token ' + this.jwt);
        var dashUrl = '/environments';
        return this.http.request(dashUrl, { headers: headers })
            .debounceTime(400)
            .distinctUntilChanged()
            .toPromise();
    };
    DashService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DashService);
    return DashService;
}());
exports.DashService = DashService;
//# sourceMappingURL=dash.service.js.map