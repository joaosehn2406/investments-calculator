import {Component, inject, signal} from '@angular/core';
import {BoardModel, CurrencyType, PeriodType} from './shared/model/board.model';
import {InvestmentModel} from './shared/model/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {FooterComponent} from './features/footer/footer.component';
import {ToastComponent} from './shared/toast/toast.component';
import {LocalStorageModel} from './shared/model/localStorage.model';
import {finalize} from 'rxjs';
import {ToastService} from './core/services/toast.service';
import {InvestmentApiService} from './core/services/invesment.api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    BoardComponent,
    FooterComponent,
    InvestmentTableComponent,
    ToastComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  private investmentApiService = inject(InvestmentApiService)
  private toastService = inject(ToastService)

  result = signal<InvestmentModel[]>([]);
  selectedPeriod = signal<PeriodType>('year')
  selectedCurrency = signal<CurrencyType>('USD')
  selectedForComparison = signal<LocalStorageModel[]>([]);
  shouldCleanInputs = signal<boolean>(false)
  isLoading = signal<boolean>(false)

  onCalculate(data: BoardModel) {
    this.isLoading.set(true)

    this.investmentApiService.calculate(data)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.result.set(response.results);
          this.selectedPeriod.set(data.period);
          this.selectedCurrency.set(data.currency);
          this.selectedForComparison.set([]);
          this.shouldCleanInputs.set(false);
        },
        error: (err) => {
          const message = err?.error?.errors
            ? Object.values(err.error.errors).flat().join(', ')
            : 'Calculation failed';

          this.toastService.show(message, 'error')
        }
      });
  }

  onDeleteAllData() {
    this.result.set([])
    this.selectedForComparison.set([])
    this.shouldCleanInputs.set(true)
  }

  onHandleComparison(ids: string[]) {
    this.isLoading.set(true);

    if (ids.length === 1) {
      this.investmentApiService.getInvestmentById(ids[0])
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => {
            const mapped = data.results.map(r => ({
              ...r,
              investmentType: data.investmentType as PeriodType,
              currency: data.currency as CurrencyType
            }));
            this.result.set(mapped);
            this.selectedForComparison.set([]);
          },
          error: () => this.toastService.show('Failed to load', 'error')
        });
    } else if (ids.length === 2) {
      this.investmentApiService.getComparableInvestments(ids)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            const mapped: LocalStorageModel[] = response.comparableItems.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              createdAt: item.calculatedAt,
              results: item.results.map(r => ({
                period: r.period,
                investmentValue: r.investmentValue,
                interestYear: r.interestYear,
                totalInterest: r.totalInterest,
                investedCapital: r.investedCapital,
                investmentType: item.investmentType as PeriodType,
                currency: item.currency as CurrencyType
              }))
            }));

            this.selectedForComparison.set(mapped);
            this.result.set([]);
          },
          error: (err) => {
            const message = err?.error?.error ?? 'Failed to compare';
            this.toastService.show(message, 'error');
          }
        });
    }
  }

  onHandleDelete(id: string) {
    this.isLoading.set(true);

    this.investmentApiService.deleteInvestmentById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.show('Investment deleted successfully', 'success');
        },
        error: (err) => this.toastService.show(err?.error?.error ?? "Failed to delete investment", 'error')
      });
  }
}
