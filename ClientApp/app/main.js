"use strict";
// The usual bootstrapping imports
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var app_component_1 = require('./app.component');
/*
bootstrap(AppComponent, [ HTTP_PROVIDERS ]);
 */
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    http_1.HTTP_PROVIDERS
]);
//# sourceMappingURL=main.js.map