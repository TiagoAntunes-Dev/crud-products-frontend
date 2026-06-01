import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  displayedColumns = ['name', 'description', 'createdAt', 'acoes'];
  categories: Category[] = [];
  loading = true;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.categoryService.listar().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  nova(): void {
    this.router.navigate(['/categories/new']);
  }

  remover(category: Category): void {
    const id = category._id;
    if (!id) {
      this.snackBar.open('Categoria sem identificador. Atualize a lista e tente novamente.', 'OK', {
        duration: 4000,
      });
      return;
    }

    const name = category.name;
    if (
      !confirm(
        `Excluir a categoria "${name}"?\nSe houver produtos vinculados, a exclusão será bloqueada.`,
      )
    )
      return;

    this.categoryService.remover(id).subscribe({
      next: () => {
        this.snackBar.open('Categoria excluída.', 'OK', { duration: 3000 });
        this.carregar();
      },
      // Trata o erro 409: categoria tem produtos vinculados (regra de negócio)
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Erro ao excluir categoria.', 'OK', {
          duration: 5000,
        });
      },
    });
  }
}
