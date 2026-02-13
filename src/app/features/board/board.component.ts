import {Component, inject, output} from '@angular/core';
import {BoardModel} from '../../shared/models/board.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BoardComponent {
  calculate = output<BoardModel>()

  private fb = inject(FormBuilder)

  form = this.fb.group({
    initialInvestment: [null as number | null, [Validators.required, Validators.min(1)]],
    annualInvestment: [null as number | null, [Validators.required, Validators.min(0)]],
    expectedReturn: [null as number | null, [Validators.required, Validators.min(1), Validators.max(200)]],
    duration: [null as number | null, [Validators.required, Validators.min(1), Validators.max(80)]]
  })

  onCalculate() {
    if (this.form.invalid) return;

    this.calculate.emit(this.form.value as BoardModel);
    this.form.reset();
  }
}
