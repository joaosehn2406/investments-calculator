import {Injectable, WritableSignal} from '@angular/core';
import {LocalStorageModel} from '../../shared/model/localStorage.model';

const KEY = 'investment_history_v1';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

  private read(): LocalStorageModel[] {
    const data = localStorage.getItem(KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as LocalStorageModel[];
    } catch {
      return [];
    }
  }

  list(): LocalStorageModel[] {
    return this.read();
  }

  add(item: LocalStorageModel) {
    const current = this.read();
    const next = [item, ...current];
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  delete(): string {
    const current = this.read();

    if (current.length === 0) {
      return "There's nothing to delete!";
    }

    localStorage.removeItem(KEY);
    return 'All investments were deleted! ✅';
  }

  validateInvestmentType(ids: WritableSignal<Set<string>>): boolean {
    if (ids().size !== 2) return false;

    const allInvestments = this.list();

    const selectedItems = allInvestments.filter(item => ids().has(item.id));

    if (selectedItems.length === 2) {
      const [item1, item2] = selectedItems;
      return item1.results[0].investmentType === item2.results[0].investmentType;
    }

    return false;
  }
}
