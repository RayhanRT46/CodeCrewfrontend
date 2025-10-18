import { Component } from '@angular/core';
import { BrandModel } from './brandModel';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand.html',
  styleUrls: ['./brand.css', '../common.css']
})
export class Brand {
  BACKEND_URL = environment.apiUrl;
  brandList: BrandModel[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  editingUserId: number | null = null;

  constructor(public service: ProductService) {}

  ngOnInit(): void {
    this.loadBrand();
  }

  // ✅ Fixed loadBrand()
  loadBrand() {
    this.service.GetBrand().subscribe({
      next: (res: any[]) => {
        this.brandList = res.map(brand => ({
          ...brand,
          logoUrl: brand.logoUrl?.startsWith('http')
            ? brand.logoUrl
            : `${this.BACKEND_URL}${brand.logoUrl}`
        }));
      },
      error: err => {
        console.error('Failed to load brands', err);
        this.message = '❌ Failed to load brands';
        this.messageType = 'error';
      }
    });
  }

  DeleteBrand(id: number) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.service.Deletebrand(id).subscribe({
        next: () => {
          this.message = "✅ Deleted successfully";
          this.messageType = 'success';
          this.loadBrand();
        },
        error: () => {
          this.message = "❌ Delete failed";
          this.messageType = 'error';
        }
      });
    }
  }

  startEdit(id: number) {
    this.editingUserId = id;
  }

  onFileChange(event: any, brand: any) {
    const file = event.target.files[0];
    if (file) brand.selectedFile = file;
  }

  saveEdit(brand: any) {
    const formData = new FormData();
    formData.append('Name', brand.name);
    if (brand.selectedFile) {
      formData.append('ImageFile', brand.selectedFile);
    }

    this.service.UpdateBrand(brand.id, formData).subscribe({
      next: () => {
        this.message = '✅ Brand updated successfully!';
        this.messageType = 'success';
        this.editingUserId = null;
        this.loadBrand();
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Failed to update brand!';
        this.messageType = 'error';
      }
    });
  }

  cancelEdit() {
    this.editingUserId = null;
  }
}
