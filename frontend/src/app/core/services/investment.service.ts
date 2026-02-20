import {Injectable, WritableSignal} from '@angular/core';
import {LocalStorageService} from './localStorage.service';

@Injectable({ providedIn: 'root' })
export class InvestmentService {

  constructor(private localStorageService: LocalStorageService) {}

  validateInvestmentType(ids: WritableSignal<Set<string>>): boolean {
    if (ids().size !== 2) return false;

    const allInvestments = this.localStorageService.list();

    const selectedItems = allInvestments.filter(item => ids().has(item.id));

    if (selectedItems.length === 2) {
      const [item1, item2] = selectedItems;
      return item1.results[0].investmentType === item2.results[0].investmentType;
    }

    return false;
  }
}
