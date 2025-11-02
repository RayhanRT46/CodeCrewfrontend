import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeService } from '../dashboard/home-page/home-service'; 
import { ProductService } from '../dashboard/product/service/product.service'; 
import { SlideService } from '../dashboard/Slider/sliderService/slide-service'; 
import { environment } from '../environment'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
 BACKEND_URL = environment.apiUrl;
  config: any = null;
  slides: any[] = [];
  
  // Object to load products based on sections
  productSections: { headline: string, categoryId: number, showCount: number, products: any[] }[] = [];

  constructor(
    private homeService: homeService,
    private slideService: SlideService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadAll(); // Load all necessary data when the component initializes
  }

  loadAll() {
    this.homeService.getConfig().subscribe({
      next: (cfg: any) => {
        if (!cfg?.config) return; // Exit if config is not available
        this.config = cfg.config;
        
        // Load slides based on config
        this.loadSlides(); 
        
        // Setup and load product sections based on config
        this.setupProductSections();
      },
      error: (err: any) => console.error('❌ Failed to load home config:', err),
    });
  }

  loadSlides() {
    this.slideService.getSlides().subscribe({
      next: (res: any[]) => {
        // Filter slides based on IDs provided in config.section1Slides
        const slideIds = this.config.section1Slides || [];
        this.slides = res
          .filter(s => slideIds.includes(s.id)) // Filter by ID from config
          .map(s => ({
            ...s,
            // Correctly set the image URL
            imageUrl: this.formatImageUrl(s.imageUrl), 
          }));
      },
      error: (err) => console.error('❌ Failed to load slides:', err),
    });
  }

  // New method to set up multiple product sections
  setupProductSections() {
    const sections = [];
    
    // Section 4 (Consumer Electronics)
    if (this.config.section4?.categoryId) {
        sections.push({
            headline: this.config.section4.headline || "Featured Products",
            categoryId: parseInt(this.config.section4.categoryId),
            showCount: this.config.section4.showCount || 4,
            products: []
        });
    }

    // Section 5 (Home & Kitchen, Clothing) - can be an array of sections
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
    this.loadProductsForSections(); // Start loading products for the sections
  }
  
  // Loop to load products for each defined section
  loadProductsForSections() {
      this.productSections.forEach(section => {
          this.productService.GetProductWithFiltering(section.categoryId, section.showCount).subscribe({
              next: (res: any) => {
                  // Using the 'Data' array from the API response
                  section.products = res.Data.map((p: any) => ({
                      ...p,
                      // Set the URL of the first product image
                      imageUrl: this.formatImageUrl(p.images && p.images.length > 0 ? p.images[0].imageUrl : null),
                      // Calculate the average review rating for the product
                      averageRating: p.reviews?.length > 0 ? p.reviews.map((r:any) => r.rating).reduce((a:number, b:number) => a + b) / p.reviews.length : 0
                  }));
              },
              error: (err) => console.error(`❌ Failed to load products for category ${section.categoryId}:`, err)
          });
      });
  }

  // Helper method to format image URL
  formatImageUrl(url: string | null): string | null {
      if (!url) return null;
      // Prepend BACKEND_URL if the URL is relative (does not start with 'http')
      return url.startsWith('http') ? url : `${this.BACKEND_URL}${url}`;
  }
  
  // Method to handle click on view button/icon
  viewProductDetails(slug: string) {
    // Here you would use routing logic to navigate to the product details page
    console.log(`Navigating to product details for: ${slug}`);
    // Example: this.router.navigate(['/product', slug]);
  }

}