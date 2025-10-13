import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-types-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-types-create.html',
  styleUrls: ['./product-types-create.css']   // fixed
})
export class ProductTypesCreate {
  @Output() back = new EventEmitter<void>();

  dataForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private service: ProductService) {
    this.dataForm = this.fb.group({
      productTypeName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) return;
    const productTypeData = {
      productTypeName: this.dataForm.get('productTypeName')?.value,
    };
    this.service.AddProductType(productTypeData).subscribe({
      next: () => {
        this.message = '✅ Product type added successfully!';
        this.dataForm.reset();
        this.back.emit();
      },
      error: () => {
        this.message = '❌ Product type add failed!';
      }
    });
  }

  onBackClick() {
    this.back.emit();
  }
}
