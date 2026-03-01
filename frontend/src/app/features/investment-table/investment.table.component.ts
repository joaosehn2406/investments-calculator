import {Component, effect, inject, input, output, signal} from '@angular/core';
import {InvestmentModel} from '../../shared/model/investment.model';
import ExcelJS from 'exceljs';
import {CurrencyPipe} from '@angular/common';
import {ToastService} from '../../core/services/toast.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalStorageService} from '../../core/services/localStorage.service';
import {LocalStorageModel} from '../../shared/model/localStorage.model';
import {CurrencyType, PeriodType} from '../../shared/model/board.model';
import {InvestmentApiService} from '../../core/services/invesment.api.service';
import {SaveInvestmentRequest} from '../../shared/model/save.investment.model';

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
  readonly currency = input.required<CurrencyType>();
  readonly comparisonData = input<LocalStorageModel[]>();
  readonly title = input<string>('');

  readonly deleteAllData = output<void>()
  readonly savingLoading = output<boolean>()

  private localStorageService = inject(LocalStorageService)
  private investmentApiService = inject(InvestmentApiService)
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

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Investments');

    sheet.columns = [
      {header: 'Period', key: 'period', width: 10},
      {header: 'Investment Value', key: 'investmentValue', width: 20},
      {header: 'Interest', key: 'interestYear', width: 18},
      {header: 'Total Interest', key: 'totalInterest', width: 18},
      {header: 'Invested Capital', key: 'investedCapital', width: 20},
    ];

    this.data().forEach(d => sheet.addRow(d));

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'investment-exported.xlsx';
      a.click();
      URL.revokeObjectURL(url);
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

    this.saveInvestment()
  }

  private saveInvestment() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Fill Title and Description accordingly.', 'error');
      return;
    }

    const {investmentTitle, investmentDescription} = this.form.getRawValue()

    const apiPayload: SaveInvestmentRequest = {
      title: investmentTitle!,
      description: investmentDescription!,
      currency: this.currency(),
      investmentType: this.period(),
      results: this.data().map(r => ({
        period: r.period,
        investmentValue: r.investmentValue,
        interestYear: r.interestYear,
        totalInterest: r.totalInterest,
        investedCapital: r.investedCapital
      }))
    }

    this.savingLoading.emit(true)

    this.investmentApiService.saveInvestment(apiPayload).subscribe({
      next: (response) => {
        const localPayload: LocalStorageModel = {
          id: response.id,
          createdAt: new Date().toISOString(),
          title: investmentTitle,
          description: investmentDescription,
          results: this.data()
        }
        this.localStorageService.add(localPayload);

        this.toastService.show('Investment saved! ✅');
        this.showInputField.set(false);
        this.isResultSaved.set(true);
        this.form.reset({investmentTitle: '', investmentDescription: ''});
        this.savingLoading.emit(false)
      },
      error: () => {
        const localPayload: LocalStorageModel = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          title: investmentTitle,
          description: investmentDescription,
          results: this.data()
        }
        this.localStorageService.add(localPayload);

        this.toastService.show('Saved locally (server unavailable)', 'error');
        this.showInputField.set(false);
        this.isResultSaved.set(true);
        this.form.reset({investmentTitle: '', investmentDescription: ''});
        this.savingLoading.emit(false)
      }
    });
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
