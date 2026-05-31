import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products:   Product[]  = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService:  ProductService,
    private categoryService: CategoryService,
    public  authService:     AuthService
  ) {}

  ngOnInit(): void {
    // forkJoin dispara as duas chamadas em paralelo e aguarda ambas
    forkJoin({
      products:   this.productService.listar(),
      categories: this.categoryService.listar()
    }).subscribe({
      next: ({ products, categories }) => {
        this.products   = products;
        this.categories = categories;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get totalProdutos():   number { return this.products.length; }
  get totalCategorias(): number { return this.categories.length; }
  get totalEstoque():    number { return this.products.reduce((s, p) => s + (p.quantity ?? 0), 0); }
  get valorTotal():      number { return this.products.reduce((s, p) => s + (p.price * (p.quantity ?? 0)), 0); }
  get userName():        string { return this.authService.getUser()?.name ?? ''; }
}
