import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { CartDto } from '../dto/orders.dto';
import { toCart } from '../mappers/cart.mapper';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly api = inject(ApiClientService);

  getCart(): Observable<Cart> {
    return this.api.get<CartDto>('/cart').pipe(map(toCart));
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.api.post<CartDto>('/cart/items', { productId, quantity }).pipe(map(toCart));
  }

  setQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.api.put<CartDto>(`/cart/items/${productId}`, { quantity }).pipe(map(toCart));
  }

  removeItem(productId: number): Observable<Cart> {
    return this.api.delete<CartDto>(`/cart/items/${productId}`).pipe(map(toCart));
  }
}