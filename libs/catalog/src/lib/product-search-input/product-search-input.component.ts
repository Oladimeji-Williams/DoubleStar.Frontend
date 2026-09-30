// libs/catalog/src/lib/product-search-input/product-search-input.component.ts
import { Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ProductsApiService } from '../products-api.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search-input.component.html',
  styleUrl: './product-search-input.component.scss',
})
export class ProductSearchInputComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchTerm$ = new Subject<string>();

  readonly productSelected = output<Product>();

  protected readonly searchTerm = signal('');
  protected readonly results = signal<Product[]>([]);
  protected readonly selected = signal<Product | null>(null);

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          term.trim() ? this.productsApi.search(term).pipe(catchError(() => of([] as Product[]))) : of([] as Product[]),
        ),
      )
      .subscribe((results) => this.results.set(results));
  }

  protected onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.searchTerm$.next(term);
  }

  protected select(product: Product): void {
    this.selected.set(product);
    this.results.set([]);
    this.searchTerm.set('');
    this.productSelected.emit(product);
  }

  protected clear(): void {
    this.selected.set(null);
  }
}