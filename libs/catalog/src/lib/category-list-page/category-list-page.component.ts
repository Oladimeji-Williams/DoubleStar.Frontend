// libs/catalog/src/lib/category-list-page/category-list-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesApiService } from '../categories-api.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list-page.component.html',
  styleUrl: './category-list-page.component.scss',
})
export class CategoryListPageComponent implements OnInit {
  private readonly categoriesApi = inject(CategoriesApiService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly newName = signal('');
  protected readonly isBusy = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.categoriesApi.getAll().subscribe((categories) => this.categories.set(categories));
  }

  protected add(): void {
    const name = this.newName().trim();
    if (!name) return;

    this.isBusy.set(true);
    this.categoriesApi.create(name).subscribe(() => {
      this.isBusy.set(false);
      this.newName.set('');
      this.load();
    });
  }
}