import { Component } from '@angular/core';
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
    CommonModule, ReactiveFormsModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  loading = false;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(40)
    ]),
    description: new FormControl('', [Validators.maxLength(120)])
  });

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.categoryService.criar(this.form.value as any).subscribe({
      next: () => {
        this.snackBar.open('Categoria criada com sucesso!', 'OK', { duration: 3000 });
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        // Código 409 = nome duplicado (índice único no MongoDB)
        this.snackBar.open(
          err.error?.message || 'Erro ao criar categoria.',
          'OK', { duration: 4000 }
        );
        this.loading = false;
      }
    });
  }

  cancelar(): void { this.router.navigate(['/categories']); }

  get name()        { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
  get charName():   number { return this.name?.value?.length ?? 0; }
  get charDesc():   number { return this.description?.value?.length ?? 0; }
}
