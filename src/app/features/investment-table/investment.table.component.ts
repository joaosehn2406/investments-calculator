import {Component, inject, input} from '@angular/core';
import {InvestmentModel} from '../../shared/models/investment.model';
import * as XLSX from 'xlsx';
import {CurrencyPipe} from '@angular/common';
import {ToastService} from '../../core/services/toast.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalStorageService} from '../../core/services/localStorage.service';

@Component({
  selector: 'app-investment-table',
  templateUrl: './investment.table.component.html',
  standalone: true,
  styleUrl: './investment.table.component.css',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule
  ]
})
export class InvestmentTableComponent {
  readonly data = input.required<InvestmentModel[]>();

  private toastService = inject(ToastService);

  private localStorageService = inject(LocalStorageService)

  private fb = inject(FormBuilder);

  form = this.fb.group({
    investmentTitle: ['', [Validators.required, Validators.maxLength(120)]],
    investmentDescription: ['', [Validators.required, Validators.maxLength(250)]]
  });

  showInputField: boolean = false

  exportToExcel() {
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data());
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');

    try {
      XLSX.writeFile(workbook, 'investment-exported.xlsx');
      this.toastService.show('Excel exported successfully! ✅');
    } catch (error) {
      this.toastService.show('Error on exporting', 'error');
    }
  }

  onPrimaryAction() {
    if (!this.showInputField) {
      this.showInputField = true;
      return
    }

    this.saveInfosToLocalStorage()
  }

  private saveInfosToLocalStorage() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Fill Title and Description accordingly.', 'error');
      return;
    }

    const {investmentTitle, investmentDescription} = this.form.getRawValue()

    const payload = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: investmentTitle,
      description: investmentDescription,
      results: this.data
    }

    this.localStorageService.add(payload);

    this.toastService.show('Investment saved! ✅');
    this.showInputField = false;
    this.form.reset({investmentTitle: '', investmentDescription: ''});
  }

  deleteInvestments() {
    const message = this.localStorageService.delete();

    if(message.includes('nothing')) {
      this.toastService.show(message, 'error')
      return
    }

    this.toastService.show(message);
  }
}
