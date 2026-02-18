import {Component, effect, inject, input, output, signal} from '@angular/core';
import {InvestmentModel} from '../../shared/model/investment.model';
import * as XLSX from 'xlsx';
import {CurrencyPipe} from '@angular/common';
import {ToastService} from '../../core/services/toast.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalStorageService} from '../../core/services/localStorage.service';
import {LocalStorageModel} from '../../shared/model/localStorage.model';
import {CurrencyType, PeriodType} from '../../shared/model/board.model';

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
  readonly period = input.required<PeriodType>();
  readonly currency = input.required<CurrencyType>()

  readonly deleteAllData = output<void>()

  private localStorageService = inject(LocalStorageService)
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  isResultSaved = signal<boolean>(false)
  showInputField = signal<boolean>(false);

  form = this.fb.group({
    investmentTitle: ['', [Validators.required, Validators.maxLength(120)]],
    investmentDescription: ['', [Validators.required, Validators.maxLength(250)]]
  });

  constructor() {
    effect(() => {
      this.data();
      this.isResultSaved.set(false);
    });
  }

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
    if (this.isResultSaved()) return;

    if (!this.showInputField()) {
      this.showInputField.set(true);
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

    const payload: LocalStorageModel = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: investmentTitle,
      periodType: this.period(),
      description: investmentDescription,
      results: this.data()
    }

    this.localStorageService.add(payload);

    this.toastService.show('Investment saved! ✅');
    this.showInputField.set(false);
    this.isResultSaved.set(true);
    this.form.reset({investmentTitle: '', investmentDescription: ''});
  }

  deleteInvestments() {
    const message = this.localStorageService.delete();

    if (message.includes('nothing')) {
      this.toastService.show(message, 'error')
      return
    }

    this.deleteAllData.emit()

    this.toastService.show(message);
  }
}
