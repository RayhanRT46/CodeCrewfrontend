import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeService } from '../dashboard/home-page/home-service';
import { ProductService } from '../dashboard/product/service/product.service';
import { SlideService } from '../dashboard/Slider/sliderService/slide-service';
import { environment } from '../environment';
import { RouterLink } from '@angular/router';
import { Cartservice } from '../cart/cartservice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  BACKEND_URL = environment.apiUrl;
  config: any = null;
  slides: any[] = [];
  currentSlideIndex: number = 0;
  slideInterval: any;
  productSections: { headline: string, categoryId: number, showCount: number, products: any[] }[] = [];

  constructor(
    private homeService: homeService,
    private slideService: SlideService,
    private productService: ProductService,
    private cartService: Cartservice
  ) { }

  ngOnInit() {
    this.loadAll(); 
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  loadAll() {
    this.homeService.getConfig().subscribe({
      next: (cfg: any) => {
        if (!cfg?.config) return;
        this.config = cfg.config;
        this.loadSlides();
        this.setupProductSections();
      },
      error: (err: any) => console.error(err),
    });
  }

  loadSlides() {
    this.slideService.getSlides().subscribe({
      next: (res: any[]) => {
        const slideIds = this.config.section1Slides || [];
        this.slides = res
          .filter(s => slideIds.includes(s.id))
          .map(s => ({
            ...s,
            imageUrl: this.formatImageUrl(s.imageUrl),
          }));
        this.startSlideshow();
      },
      error: (err) => console.error(err),
    });
  }

  startSlideshow() {
    if (this.slides.length > 1) {
      this.slideInterval = setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      }, 5000); 
    }
  }

  setupProductSections() {
    const sections = [];
    if (this.config.section4?.categoryId) {
      sections.push({
        headline: this.config.section4.headline || "Featured Products",
        categoryId: parseInt(this.config.section4.categoryId),
        showCount: this.config.section4.showCount || 4,
        products: []
      });
    }

    if (this.config.section5?.length) {
      this.config.section5.forEach((sec: any) => {
        if (sec.categoryId) {
          sections.push({
            headline: sec.headline,
            categoryId: parseInt(sec.categoryId),
            showCount: sec.showCount || 6,
            products: []
          });
        }
      });
    }

    this.productSections = sections;
    this.loadProductsForSections();
  }

  loadProductsForSections() {
    this.productSections.forEach(section => {
      this.productService.GetProductWithFiltering(section.categoryId, section.showCount).subscribe({
        next: (res: any) => {
          const productData = res?.data || [];
          section.products = productData.map((p: any) => this.getProductForUI(p));
        },
        error: (err) => console.error(err)
      });
    });
  }

  // Unified function to handle different API structures
  getProductForUI(p: any) {
    return {
      id: p.id,
      productName: p.productName || p.name,
      name: p.name || p.productName,
      price: p.price,
      salePrice: p.salePrice || null,
      imageUrl: this.formatImageUrl(p.images?.[0]?.imageUrl || p.image || null),
      averageRating: p.reviews?.length ? p.reviews.map((r: any) => r.rating).reduce((a: number, b: number) => a + b) / p.reviews.length : 0
    };
  }

  formatImageUrl(url: string | null): string | null {
    if (!url) return null;
    return url.startsWith('http') ? url : `${this.BACKEND_URL}${url}`;
  }

  addToCart(product: any) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      qty: 1,
      selected: true
    });
    console.log('✅ Added to cart:', product);
  }

  viewProductDetails(slug: string) {
    console.log(`Navigating to product details for: ${slug}`);
  }

  getPromoSlide(slideId: number) {
    return this.slides?.find(s => s.id === slideId);
  }
}
