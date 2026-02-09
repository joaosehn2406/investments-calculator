import {NgModule} from '@angular/core';
import {InvestmentTable} from './investment-table';
import {DecimalPipe} from '@angular/common';

@NgModule({
  declarations: [InvestmentTable],
  imports: [
    DecimalPipe
  ],
  exports: [InvestmentTable]
})
export class InvestmentTableModule{}
