import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem, Cartservice } from '../cartservice';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-cart.html',
  styleUrls: ['./floating-cart.css']
})
export class FloatingCart implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  showCart = false;

  constructor(private cartService: Cartservice) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.updateTotal();
    });
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  toggleSelect(id: number): void {
    this.cartService.toggleSelect(id);
    this.updateTotal();
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
    this.updateTotal();
  }

  updateTotal(): void {
    this.totalPrice = this.cartService.getTotalPrice(true);
  }
  

  checkout(): void {
    const selected = this.cartService.getSelectedItems();
    alert(`Proceeding to checkout with ${selected.length} items`);
  }
  increase(item: CartItem) {
  this.cartService.updateQty(item.id, item.qty + 1);
  this.updateTotal();
}

decrease(item: CartItem) {
  if (item.qty > 1) {
    this.cartService.updateQty(item.id, item.qty - 1);
    this.updateTotal();
  }
}

}
