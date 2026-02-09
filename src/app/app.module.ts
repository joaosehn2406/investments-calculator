import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeaderModule} from './header/header.module';
import {BrowserModule} from '@angular/platform-browser';
import {BoardModule} from './board/board.module';
import {InvestmentTableModule} from './investment-table/investment-table.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, HeaderModule, BoardModule, InvestmentTableModule]
})
export class AppModule {
}
