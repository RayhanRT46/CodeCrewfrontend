import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../service/product.service'; 

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.html',
  styleUrls: ['./product-create.css']
})
export class ProductCreate {
  productForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  categories: any[] = [];
  brands: any[] = [];
  productTypes: any[] = [];
  images: File[] = [];

  constructor(
    private fb: FormBuilder,
    private Service: ProductService
  ) {}

  @Output() back = new EventEmitter<void>();

  ngOnInit(): void {
    this.productForm = this.fb.group({
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
      attributes: this.fb.array([]),
      images: [null]
    });

    this.loadDropdowns();
  }

  // Load dropdown data
  loadDropdowns() {
    this.Service.GetCetegory().subscribe(res => (this.categories = res));
    this.Service.GetBrand().subscribe(res => (this.brands = res));
    this.Service.GetProductType().subscribe(res => (this.productTypes = res));
  }

  // Getter for attributes
  get attributes(): FormArray {
    return this.productForm.get('attributes') as FormArray;
  }

  // Add a new attribute
  addAttribute() {
    this.attributes.push(
      this.fb.group({
        name: [''],
        value: ['']
      })
    );
  }

  // Remove attribute at index
  removeAttribute(i: number) {
    this.attributes.removeAt(i);
  }

  // Helper to safely get FormControl from FormArray
  getAttributeControl(attr: AbstractControl | null, controlName: string): FormControl {
    return attr?.get(controlName) as FormControl;
  }

  // Handle file selection
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.images = Array.from(event.target.files);
    }
  }

  // Submit form
  onSubmit() {
  if (this.productForm.invalid) return;

  const formData = new FormData();
  const values = this.productForm.value;

  // LocalStorage থেকে Seller ID নেয়া
  const userData = localStorage.getItem('user');
  let sellerId = null;
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      sellerId = parsed.id || parsed.userId || parsed; // depending on how you store
    } catch {}
  }

  // সাধারণ text ফিল্ডগুলো যোগ করো
  Object.keys(values).forEach(key => {
    if (key !== 'attributes' && key !== 'images') {
      const val = values[key];
      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    }
  });

  // ✅ Attributes — JSON string হিসেবে পাঠাও
  if (values.attributes && values.attributes.length > 0) {
    const attributesJson = JSON.stringify(values.attributes.map((a: any) => ({
      Name: a.name,
      Value: a.value
    })));
    formData.append('AttributesJson', attributesJson);
  }

  // ✅ Images পাঠাও
  if (this.images && this.images.length > 0) {
    this.images.forEach(file => {
      formData.append('Images', file); // backend expects List<IFormFile> Images
    });
  }

  // ✅ Seller ID যোগ করো (যদি API চায়)
  if (sellerId) {
    formData.append('SellerId', sellerId);
  }

  // ✅ API কল
  this.Service.AddProduct(formData).subscribe({
    next: () => {
      this.message = '✅ Product created successfully!';
      this.messageType = 'success';
      this.productForm.reset();
    },
    error: err => {
      console.error(err);
      this.message = `❌ Failed to create product! (${err.status} ${err.statusText})`;
      this.messageType = 'error';
    }
  });
}
  onBackClick() {
    this.back.emit();
  }
}

