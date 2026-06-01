import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  modoEdicao = false;
  produtoId: string | null = null;
  categories: Category[] = [];
  loading = false;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    category: new FormControl<string | null>(null),
    image: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Carrega categorias para o <mat-select>
    this.categoryService.listar().subscribe({
      next: (cats) => (this.categories = cats),
    });

    // Verifica se é modo edição (tem :id na rota)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.produtoId = id;
      this.carregarProduto(id);
    }
  }

  carregarProduto(id: string): void {
    this.productService.buscarPorId(id).subscribe({
      next: (p: Product) => {
        // Extrai apenas o _id da categoria (não o objeto populado inteiro)
        const catId = p.category
          ? typeof p.category === 'object'
            ? (p.category._id ?? null)
            : p.category
          : null;

        this.form.patchValue({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image: p.image ?? '',
          category: catId,
        });
      },
      error: () => this.snackBar.open('Produto não encontrado.', 'OK', { duration: 3000 }),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    if (values.price === null || values.quantity === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const dados: Partial<Product> = {
      name: values.name.trim(),
      price: values.price,
      quantity: values.quantity,
      category: values.category || null,
      image: values.image.trim(),
    };

    const req =
      this.modoEdicao && this.produtoId
        ? this.productService.atualizar(this.produtoId, dados)
        : this.productService.criar(dados);

    req.subscribe({
      next: () => {
        const msg = this.modoEdicao ? 'Produto atualizado!' : 'Produto cadastrado!';
        this.snackBar.open(msg, 'OK', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Erro ao salvar.', 'OK', { duration: 4000 });
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/products']);
  }

  get name(): FormControl<string> {
    return this.form.controls.name;
  }
  get price(): FormControl<number | null> {
    return this.form.controls.price;
  }
  get quantity(): FormControl<number | null> {
    return this.form.controls.quantity;
  }
  get charName(): number {
    return this.name.value.length;
  }
}
