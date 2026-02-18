import {Injectable} from '@angular/core';
import {LocalStorageModel} from '../../shared/models/localStorage.model';

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
}
