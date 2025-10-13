import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ],
  styleUrls: ['./home.css'],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  categories: { name: string; img: string }[] = [];
  products: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Categories with images
    this.categories = [
      { name: 'electronics', img: 'https://via.placeholder.com/400x200?text=Electronics' },
      { name: 'jewelery', img: 'https://via.placeholder.com/400x200?text=Jewelery' },
      { name: "men's clothing", img: 'https://via.placeholder.com/400x200?text=Men+Clothing' },
      { name: "women's clothing", img: 'https://via.placeholder.com/400x200?text=Women+Clothing' }
    ];

    // Fetch products
    this.http.get<any[]>('https://fakestoreapi.com/products?limit=6')
      .subscribe(res => {
        this.products = res;
        this.loading = false;
      });
  }
}
