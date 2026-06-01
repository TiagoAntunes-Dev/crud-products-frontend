import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent {
  loading = false;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
  });

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue();

    this.categoryService
      .criar({
        name: payload.name.trim(),
        description: payload.description.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Categoria criada com sucesso!', 'OK', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: (err: HttpErrorResponse) => {
          // Código 409 = nome duplicado (índice único no MongoDB)
          this.snackBar.open(err.error?.message || 'Erro ao criar categoria.', 'OK', {
            duration: 4000,
          });
          this.loading = false;
        },
      });
  }

  cancelar(): void {
    this.router.navigate(['/categories']);
  }

  get name(): FormControl<string> {
    return this.form.controls.name;
  }
  get description(): FormControl<string> {
    return this.form.controls.description;
  }
  get charName(): number {
    return this.name.value.length;
  }
  get charDesc(): number {
    return this.description.value.length;
  }
}
