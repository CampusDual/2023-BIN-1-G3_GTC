import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrucksRoutingModule } from './trucks-routing.module';
import { TrucksHomeComponent } from './trucks-home/trucks-home.component';
import { TrucksDetailComponent } from './trucks-detail/trucks-detail.component';


@NgModule({
  declarations: [TrucksHomeComponent, TrucksDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    OntimizeWebModule,
    TrucksRoutingModule
  ]
})
export class TrucksModule { }
