import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from './service/product.service';
import { environment } from '../../environment';
import { ProductImage } from './productModel';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class Product {
  BACKEND_URL = environment.apiUrl;
  productList: any[] = [];
  editProduct: any = null;
  updateForm!: FormGroup;
  categories: any[] = [];
  brands: any[] = [];
  productTypes: any[] = [];
  newImages: File[] = [];
  existingImages: ProductImage[] = [];

  // ✅ Bulk Action properties
  selectedProducts: number[] = [];
  selectAll: boolean = false;
  bulkActionType: 'delete' | 'activate' | 'deactivate' | '' = '';

  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private service: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadDropdowns();
  }

  loadProducts() {
    this.service.GetProduct().subscribe({
      next: (res: any[]) => {
        // ✅ Ensure images have full URL
        this.productList = res.map(p => ({
          ...p,
          images: p.images?.map((img: any) => ({
            imageUrl: img.imageUrl.startsWith('http') ? img.imageUrl : `${this.BACKEND_URL}${img.imageUrl}`
          }))
        }));

        // Reset selected products if needed (optional)
        this.selectedProducts = this.productList
          .filter(p => this.selectedProducts.includes(p.id))
          .map(p => p.id);
        this.selectAll = this.selectedProducts.length === this.productList.length && this.productList.length > 0;

      },
      error: err => console.error('Failed to load products', err)
    });
  }

  loadDropdowns() {
    //Assuming these methods exist in your service
    this.service.GetCetegory().subscribe(res => (this.categories = res));
    this.service.GetBrand().subscribe(res => (this.brands = res));
    this.service.GetProductType().subscribe(res => (this.productTypes = res));
  }

  initForm() {
    this.updateForm = this.fb.group({
      // ... form controls ... (same as before)
      productName: ['', Validators.required],
      slug: [''],
      description: [''],
      price: ['', Validators.required],
      salePrice: [''],
      stockQuantity: ['', Validators.required],
      weightUnit: [''],
      unitQuantity: [''],
      categoryId: ['', Validators.required],
      brandId: [''],
      productTypeId: [''],
      attributes: this.fb.array([])
    });
  }

  onEdit(product: any) {
    this.editProduct = product;
    this.initForm();
    this.fillFormWithProduct();
  }

  fillFormWithProduct() {
    const p = this.editProduct;

    // Existing images
    this.existingImages = p.images || [];

    // Patch form values
    this.updateForm.patchValue({
      productName: p.productName,
      slug: p.slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      stockQuantity: p.stockQuantity,
      weightUnit: p.weightUnit,
      unitQuantity: p.unitQuantity,
      categoryId: p.categoryId,
      brandId: p.brandId,
      productTypeId: p.productTypeId
    });

    // Attributes
    const attrArray = this.updateForm.get('attributes') as FormArray;
    attrArray.clear();
    if (p.attributes && p.attributes.length) {
      p.attributes.forEach((a: any) => {
        attrArray.push(
          this.fb.group({
            name: [a.name],
            value: [a.value]
          })
        );
      });
    }
  }

  get attributes(): FormArray {
    return this.updateForm.get('attributes') as FormArray;
  }

  addAttribute() {
    this.attributes.push(this.fb.group({ name: [''], value: [''] }));
  }

  removeAttribute(i: number) {
    this.attributes.removeAt(i);
  }

  getAttributeControl(attr: any, name: string): FormControl {
    return attr.get(name) as FormControl;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.newImages = Array.from(event.target.files);
    }
  }

  removeExistingImage(imgToRemove: ProductImage) {
    this.existingImages = this.existingImages.filter(img => img !== imgToRemove);
  }

  onSubmit() {
    if (this.updateForm.invalid) return;

    const formData = new FormData();
    const values = this.updateForm.value;

    Object.keys(values).forEach(key => {
      if (key !== 'attributes') {
        const val = values[key];
        if (val !== null && val !== undefined) formData.append(key, val);
      }
    });

    if (values.attributes?.length) {
      const attrJson = JSON.stringify(
        values.attributes.map((a: any) => ({ Name: a.name, Value: a.value }))
      );
      formData.append('AttributesJson', attrJson);
    }

    // Note: The C# API doesn't seem to use ExistingImages for update, it deletes all and re-uploads new ones.
    // If you need to keep existing images without re-uploading, you should update your C# logic.
    // As per your C# API, we only send new images. The C# API deletes old images and saves new ones.

    this.newImages.forEach(file => formData.append('Images', file));

    this.service.UpdateProduct(this.editProduct.id, formData).subscribe({
      next: () => {
        this.message = '✅ Product updated successfully!';
        this.messageType = 'success';
        this.loadProducts();
        this.editProduct = null;
        this.newImages = []; // Clear new images after successful upload
      },
      error: err => {
        console.error(err);
        this.message = '❌ Failed to update product!';
        this.messageType = 'error';
      }
    });
  }

  onCancel() {
    this.editProduct = null;
    this.newImages = []; // Clear new images on cancel
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.service.DeleteProduct(id).subscribe({
        next: () => {
          this.productList = this.productList.filter(p => p.id !== id);
          this.message = '✅ Product deleted successfully!';
          this.messageType = 'success';
          this.loadProducts();
        },
        error: err => {
          console.error('Failed to delete product', err);
          this.message = '❌ Failed to delete product!';
          this.messageType = 'error';
        }
      });
    }
  }

  // --- New Functions for Bulk/Status Actions ---

  toggleProductSelection(id: number, isChecked: boolean) {
    if (isChecked) {
      this.selectedProducts.push(id);
    } else {
      this.selectedProducts = this.selectedProducts.filter(productId => productId !== id);
    }
    this.selectAll = this.selectedProducts.length === this.productList.length && this.productList.length > 0;
  }

  toggleSelectAll(isChecked: boolean) {
    this.selectAll = isChecked;
    if (this.selectAll) {
      this.selectedProducts = this.productList.map(p => p.id);
    } else {
      this.selectedProducts = [];
    }
  }

  performBulkAction() {
    this.service.bulkAction(this.selectedProducts, this.bulkActionType).subscribe({
      
      next: () => {
        this.selectedProducts = []; // Clear selections
        this.selectAll = false;
        this.bulkActionType = '';
        this.message = `✅ Bulk action '${this.bulkActionType}' completed successfully!`;
        this.messageType = 'success';
        this.loadProducts(); // Reload data to reflect changes
      },
      error: err => {
        console.error('Bulk action failed', err);
        this.message = `❌ Bulk action '${this.bulkActionType}' failed!`;
        this.messageType = 'error';
      }
    });
  }

  toggleStatus(id: number, currentStatus: boolean) {
    debugger
    const newStatus = !currentStatus;
    this.service.toggleProductStatus(id, newStatus).subscribe({
      next: (res: any) => {
        const product = this.productList.find(p => p.id === id);
        if (product) {
          product.isActive = res.isActive; // Update local state
        }

        this.message = `✅ Product status updated to ${newStatus ? 'Active' : 'Inactive'}.`;
        this.messageType = 'success';
      },
      error: err => {
        console.error('Failed to toggle status', err);
        this.message = '❌ Failed to update product status!';
        this.messageType = 'error';
      }
    });
  }
}