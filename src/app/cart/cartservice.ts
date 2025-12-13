import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  qty: number;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Cartservice {
  private storageKey = 'my_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCart());
  cart$ = this.cartSubject.asObservable();

  getCart(): CartItem[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(item: CartItem): void {
    const cart = this.getCart();
    const found = cart.find(x => x.id === item.id);
    if (found) {
      found.qty += item.qty;
    } else {
      cart.push({ ...item, selected: true });
    }
    this.saveCart(cart);
  }

  updateQty(id: number, qty: number): void {
    const cart = this.getCart().map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x);
    this.saveCart(cart);
  }

  removeItem(id: number): void {
    const cart = this.getCart().filter(x => x.id !== id);
    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cartSubject.next([]);
  }

  toggleSelect(id: number): void {
    const cart = this.getCart().map(x => x.id === id ? { ...x, selected: !x.selected } : x);
    this.saveCart(cart);
  }

  getSelectedItems(): CartItem[] {
    return this.getCart().filter(x => x.selected);
  }

  getTotalItems(): number {
    return this.getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice(selectedOnly = false): number {
    const items = selectedOnly ? this.getSelectedItems() : this.getCart();
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  
}
