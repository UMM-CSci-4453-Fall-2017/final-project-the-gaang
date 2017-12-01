import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }         from './app/app.component';
import { routing } from './app/app.routes';

import { PipeModule } from './pipe.module';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        routing,
        PipeModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [ ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}