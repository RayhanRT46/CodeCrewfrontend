// shop.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../dashboard/product/service/product.service';
import { environment } from '../environment';
import { Cartservice } from '../cart/cartservice';

interface ProductFilter {
  productName: string | null;
  categoryIds: number[];
  minPrice: number | null;
  maxPrice: number | null;
  brandIds: number[];
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent implements OnInit {
  BACKEND_URL = environment.apiUrl;

  allCategories: any[] = [];
  allBrands: any[] = [];
  products: any[] = [];
  isLoading = false;
  totalProducts = 0;

  filter: ProductFilter = {
    productName: null,
    categoryIds: [],
    minPrice: null,
    maxPrice: null,
    brandIds: [],
    pageNumber: 1,
    pageSize: 12
  };

  isSidebarOpen = false;

  constructor(private productService: ProductService, private cartService: Cartservice) {}

  ngOnInit(): void {
    this.loadFiltersData();
    this.loadProducts();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Load categories and brands
  loadFiltersData(): void {
    this.productService.GetCetegory().subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.allCategories = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error('Failed to load categories', err)
    });

    this.productService.GetBrand().subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.allBrands = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error('Failed to load brands', err)
    });
  }

  // Load products
  loadProducts(): void {
    this.isLoading = true;
    this.productService.GetProductWithFilterings(
      this.filter.categoryIds.length ? this.filter.categoryIds : undefined,
      this.filter.pageSize,
      this.filter.productName,
      this.filter.minPrice,
      this.filter.maxPrice,
      undefined,
      this.filter.brandIds.length ? this.filter.brandIds : undefined,
      this.filter.pageNumber
    ).subscribe({
      next: (res: any) => {
        const productData = res?.data || res?.Data || [];
        // Map products properly with imageUrl
        this.products = productData.map((p:any) => ({
          ...p,
          name: p.productName || p.name,
          imageUrl: p.images && p.images.length > 0 ? `${this.BACKEND_URL}${p.images[0].imageUrl}` : null,
          price: p.price,
          salePrice: p.salePrice
        }));
        this.totalProducts = res?.totalCount ?? res?.TotalCount ?? this.products.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filter.pageNumber = 1;
    this.loadProducts();
  }

  onCategoryChange(categoryId: number, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.filter.categoryIds.includes(categoryId)) this.filter.categoryIds.push(categoryId);
    } else {
      this.filter.categoryIds = this.filter.categoryIds.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  onBrandChange(brandId: number, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.filter.brandIds.includes(brandId)) this.filter.brandIds.push(brandId);
    } else {
      this.filter.brandIds = this.filter.brandIds.filter(id => id !== brandId);
    }
    this.applyFilters();
  }

  onPageChange(newPage: number): void {
    if (newPage < 1) return;
    this.filter.pageNumber = newPage;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPagesArray(): number[] {
    const totalPages = Math.ceil(this.totalProducts / this.filter.pageSize);
    if (totalPages === 0) return [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.filter.pageNumber - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) startPage = Math.max(1, endPage - maxPagesToShow + 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  formatImageUrl(url: string | null): string | null {
    if (!url) return null;
    return url.startsWith('http') ? url : `${this.BACKEND_URL}${url}`;
  }

  addToCart(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      qty: 1
    });
  }
}
