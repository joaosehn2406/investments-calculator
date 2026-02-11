import {Component, Input} from '@angular/core';
import {InvestmentModel} from './invesmentModel';
import * as XLSX from 'xlsx';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-investment-table',
  templateUrl: './investment-table.html',
  styleUrl: './investment-table.css',
  imports: [
    DecimalPipe
  ]
})
export class InvestmentTable {
  @Input({required: true}) data!: InvestmentModel[]

  exportToExcel() {
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');

    XLSX.writeFile(workbook, 'investment-exported.xlsx');
  }
}
