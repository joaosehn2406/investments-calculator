import {Component, Input} from '@angular/core';
import {InvestmentModel} from './invesmentModel';

@Component({
  selector: 'app-investment-table',
  standalone: false,
  templateUrl: './investment-table.html',
  styleUrl: './investment-table.css',
})
export class InvestmentTable {
  @Input({required: true}) data!: InvestmentModel[]


}
