// libs/catalog/src/lib/brand-list-page/brand-list-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandsApiService } from '../brands-api.service';
import { Brand } from '../models/brand.model';

@Component({
  selector: 'app-brand-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-list-page.component.html',
  styleUrl: './brand-list-page.component.scss',
})
export class BrandListPageComponent implements OnInit {
  private readonly brandsApi = inject(BrandsApiService);

  protected readonly brands = signal<Brand[]>([]);
  protected readonly newName = signal('');
  protected readonly isBusy = signal(false);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.brandsApi.getAll().subscribe((brands) => this.brands.set(brands));
  }

  protected add(): void {
    const name = this.newName().trim();
    if (!name) return;

    this.isBusy.set(true);
    this.brandsApi.create(name).subscribe(() => {
      this.isBusy.set(false);
      this.newName.set('');
      this.load();
    });
  }
}