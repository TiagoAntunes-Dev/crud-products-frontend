import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  displayedColumns = ['name', 'category', 'price', 'quantity', 'acoes'];
  products: Product[] = [];
  productsFiltrados: Product[] = [];
  termoBusca = '';
  loading = true;

  constructor(
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.productService.listar().subscribe({
      next: (data) => {
        this.products = data;
        this.productsFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filtrar(): void {
    const t = this.termoBusca.toLowerCase();
    this.productsFiltrados = this.products.filter(
      (p) => p.name.toLowerCase().includes(t) || this.getCategoryName(p).toLowerCase().includes(t),
    );
  }

  // Helper: extrai nome da categoria (pode vir populado ou nulo)
  getCategoryName(p: Product): string {
    if (!p.category) return '—';
    return typeof p.category === 'object' ? p.category.name : p.category;
  }

  novo(): void {
    this.router.navigate(['/products/new']);
  }

  editar(product: Product): void {
    const id = product._id;
    if (!id) {
      this.snackBar.open('Produto sem identificador. Atualize a lista e tente novamente.', 'OK', {
        duration: 4000,
      });
      return;
    }

    this.router.navigate(['/products/edit', id]);
  }

  remover(product: Product): void {
    const id = product._id;
    if (!id) {
      this.snackBar.open('Produto sem identificador. Atualize a lista e tente novamente.', 'OK', {
        duration: 4000,
      });
      return;
    }

    const name = product.name;
    if (!confirm(`Excluir "${name}"?`)) return;
    this.productService.remover(id).subscribe({
      next: () => {
        this.snackBar.open('Produto excluído.', 'OK', { duration: 3000 });
        this.carregar();
      },
      error: (err: HttpErrorResponse) =>
        this.snackBar.open(err.error?.message || 'Erro ao excluir.', 'OK', { duration: 4000 }),
    });
  }

  get totalEstoque(): number {
    return this.products.reduce((s, p) => s + (p.quantity ?? 0), 0);
  }
  get valorTotal(): number {
    return this.products.reduce((s, p) => s + p.price * (p.quantity ?? 0), 0);
  }
}
