// The usual bootstrapping imports
import { bootstrap }      from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {enableProdMode} from '@angular/core';
import { AppComponent }   from './app.component';

/*
bootstrap(AppComponent, [ HTTP_PROVIDERS ]);
 */
enableProdMode();
bootstrap(AppComponent, [
    HTTP_PROVIDERS
]);

