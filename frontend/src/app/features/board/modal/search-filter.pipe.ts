import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'investmentSearchFilter', standalone: true, pure: true})
export class SearchFilterPipe implements PipeTransform {

  transform<T>(items: T[], term: string, keys: (keyof T)[]): T[] {
    if (!term.trim()) return items;

    const lower = term.toLowerCase();

    return items.filter(item =>
      keys.some(key =>
        String(item[key] ?? '').toLowerCase().includes(lower)
      )
    );
  }
}
