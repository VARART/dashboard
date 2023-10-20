import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GeneralTableComponent } from './general-table/general-table.component';
import { ShortInfoComponent } from './short-info/short-info.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {NgbDatepicker, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [
    AppComponent,
    GeneralTableComponent,
    ShortInfoComponent,

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepicker,
    NgbInputDatepicker,
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule {}
