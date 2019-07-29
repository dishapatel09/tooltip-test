import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExampleComponent } from './example/example.component';
import { TooltipComponent, TooltipDirective } from './domain/tooltip_control_directive';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExampleComponent,
    TooltipDirective,
    TooltipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
