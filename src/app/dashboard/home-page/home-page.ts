import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { homeService } from './home-service';
import { ProductService } from '../product/service/product.service';
import { SlideService } from '../Slider/sliderService/slide-service';
import { environment } from '../../environment';

@Component({
  selector: 'app-home-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomeEditorComponent implements OnInit {
  BACKEND_URL = environment.apiUrl;
  slides: any[] = [];
  categories: any[] = [];
  saving = false;
  configId: number | null = null;
  message: string | null = null;
  messageType: 'success' | 'danger' = 'success';

  // Default configuration structure
  config: any = {
    section1Slides: [],
    section2: [{ icon: 'bi-truck', text1: 'Free Delivery', text2: 'On all orders' }],
    section3Slides: [],
    section4: { headline: 'Consumer Electronics', categoryId: null, showCount: 4 },
    section5: [{ headline: 'Home & Kitchen', categoryId: null, showCount: 6 }],
  };

  // Constructor: Dependency Injection works now
  constructor(
    private slideService: SlideService,
    private productService: ProductService,
    private homeConfigService: homeService
  ) {}

  ngOnInit() {
    this.loadSlides();
    this.loadCategories();
    this.loadExistingConfig();
  }

  // Function to show message (instead of alert())
  showMessage(msg: string, type: 'success' | 'danger') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = null), 5000);
  }

  // Load Slides
  loadSlides() {
    this.slideService.getSlides().subscribe({
      next: (res: any[]) => {
        this.slides = res.map((s: any) => ({
          ...s,
          imageUrl: s.imageUrl?.startsWith('http')
            ? s.imageUrl
            : `${this.BACKEND_URL}${s.imageUrl}`,
        }));
      },
      error: (err: any) => console.error('❌ Slide Load Failed:', err),
    });
  }

  // Load Categories
  loadCategories() {
    this.productService.GetCetegory().subscribe({
      next: (res: any[]) => (this.categories = res),
      error: (err: any) => console.error('❌ Category Load Failed:', err),
    });
  }

  // Load existing configuration
  loadExistingConfig() {
    this.homeConfigService.getConfig().subscribe({
      next: (cfg: any) => {
        if (!cfg) return;

        console.log('Existing configuration loaded:', cfg);

        this.configId = cfg?.id || null;

        let loadedConfig = null;

        try {
          const parsed = typeof cfg === 'string' ? JSON.parse(cfg) : cfg;
          loadedConfig = parsed?.config || parsed;
        } catch (e) {
          console.warn('⚠️ Invalid JSON or non-standard format in database', e);
          return;
        }

        this.config = {
            ...this.config,
            ...loadedConfig
        };
        // Ensuring required array properties exist
        this.config.section2 = this.config.section2 || [{ icon: 'bi-truck', text1: 'Default', text2: 'Default' }];
        this.config.section5 = this.config.section5 || [{ headline: 'Default', categoryId: null, showCount: 6 }];

        this.showMessage('Previous configuration loaded.', 'success');

      },
      error: (err) => console.error('❌ Configuration Load Failed', err),
    });
  }

  // Toggle Slide Selection
  toggleSlide(section: 'section1Slides' | 'section3Slides', id: number) {
    const arr = this.config[section] || [];
    const index = arr.indexOf(id);

    if (index >= 0) {
      arr.splice(index, 1);
    } else {
      arr.push(id);
    }
    this.config[section] = [...arr]; // Create new array for Change Detection
  }

  // Add Icon + Text
  addIconText() {
    this.config.section2 = [...this.config.section2, { icon: 'bi-star', text1: '', text2: '' }];
  }

  // Remove Icon + Text
  removeIconText(i: number) {
    if (this.config.section2.length > 1) {
      this.config.section2.splice(i, 1);
      this.config.section2 = [...this.config.section2];
    }
  }

  // Add Category Block
  addCategoryBlock() {
    this.config.section5 = [
      ...this.config.section5,
      { headline: '', categoryId: null, showCount: 6 },
    ];
  }

  // Remove Category Block
  removeCategoryBlock(i: number) {
    if (this.config.section5.length > 1) {
      this.config.section5.splice(i, 1);
      this.config.section5 = [...this.config.section5];
    }
  }

  // Save Configuration (POST/PUT Logic)
  saveToBackend() {
    this.saving = true;

    const payload = { config: this.config };
    console.log('Sending Payload:', payload);

    // If configId exists, use PUT, otherwise use POST
    const request = this.configId
      ? this.homeConfigService.updateConfig(this.configId, payload)
      : this.homeConfigService.saveConfig(payload);

    request.subscribe({
      next: (res: any) => {
        this.saving = false;

        if (res?.id) {
            this.configId = res.id;
        }

        console.log('✅ Configuration successfully saved. Config ID:', this.configId);
        this.showMessage('✅ Configuration Saved Successfully!', 'success');
      },
      error: (err) => {
        this.saving = false;
        console.error('❌ Save Failed', err);
        this.showMessage('❌ Failed to save configuration.', 'danger');
      },
    });
  }
}