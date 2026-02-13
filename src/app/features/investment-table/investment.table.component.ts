import {Component, inject, Input} from '@angular/core';
import {InvestmentModel} from '../../shared/models/investment.model';
import * as XLSX from 'xlsx';
import {CurrencyPipe} from '@angular/common';
import {ToastService} from '../../core/services/toast.service';

@Component({
  selector: 'app-investment-table',
  templateUrl: './investment.table.component.html',
  standalone: true,
  styleUrl: './investment.table.component.css',
  imports: [
    CurrencyPipe
  ]
})
export class InvestmentTableComponent {
  @Input({required: true}) data!: InvestmentModel[]

  private toastService = inject(ToastService);

  exportToExcel() {
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');

    try {
      XLSX.writeFile(workbook, 'investment-exported.xlsx');
      this.toastService.show('Excel exported successfully! ✅');
    } catch (error) {
      this.toastService.show('Error on exporting', 'error');
    }
  }
}
