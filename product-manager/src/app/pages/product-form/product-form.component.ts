import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatSelectModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  modoEdicao = false;
  produtoId: string | null = null;
  categories: Category[] = [];
  loading = false;

  form = new FormGroup({
    name:     new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
    price:    new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    category: new FormControl<string | null>(null),   // ObjectId da categoria (opcional)
    image:    new FormControl('')
  });

  constructor(
    private router:          Router,
    private route:           ActivatedRoute,
    private productService:  ProductService,
    private categoryService: CategoryService,
    private snackBar:        MatSnackBar
  ) {}

  ngOnInit(): void {
    // Carrega categorias para o <mat-select>
    this.categoryService.listar().subscribe({
      next: (cats) => this.categories = cats
    });

    // Verifica se é modo edição (tem :id na rota)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.produtoId  = id;
      this.carregarProduto(id);
    }
  }

  carregarProduto(id: string): void {
    this.productService.buscarPorId(id).subscribe({
      next: (p: Product) => {
        // Extrai apenas o _id da categoria (não o objeto populado inteiro)
        const catId = p.category
          ? (typeof p.category === 'object' ? (p.category as any)._id : p.category)
          : null;

        this.form.patchValue({
          name:     p.name,
          price:    p.price,
          quantity: p.quantity,
          image:    p.image ?? '',
          category: catId
        });
      },
      error: () => this.snackBar.open('Produto não encontrado.', 'OK', { duration: 3000 })
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const dados = this.form.value;
    // Envia null se nenhuma categoria selecionada (evita enviar string vazia)
    if (!dados.category) dados.category = null;

    const req = this.modoEdicao && this.produtoId
      ? this.productService.atualizar(this.produtoId, dados as any)
      : this.productService.criar(dados as any);

    req.subscribe({
      next: () => {
        const msg = this.modoEdicao ? 'Produto atualizado!' : 'Produto cadastrado!';
        this.snackBar.open(msg, 'OK', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Erro ao salvar.', 'OK', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  cancelar(): void { this.router.navigate(['/products']); }

  get name()     { return this.form.get('name'); }
  get price()    { return this.form.get('price'); }
  get quantity() { return this.form.get('quantity'); }
  get charName(): number { return this.name?.value?.length ?? 0; }
}
