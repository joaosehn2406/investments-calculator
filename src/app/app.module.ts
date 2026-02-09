import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeaderModule} from './header/header.module';
import {BrowserModule} from '@angular/platform-browser';
import {BoardModule} from './board/board.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, HeaderModule, BoardModule]
})
export class AppModule {
}
