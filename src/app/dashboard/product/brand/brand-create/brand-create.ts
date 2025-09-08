import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-brand-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brand-create.html',
  styleUrls: ['./brand-create.css']
})
export class BrandCreate {
  @Output() back = new EventEmitter<void>();

  brandForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private service: ProductService) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      logoUrl: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.brandForm.invalid) return;

    const token = localStorage.getItem('token');
    const brandData = {
      name: this.brandForm.get('name')?.value,
      logoUrl: this.brandForm.get('logoUrl')?.value
    };
    this.service.BrandAdd(brandData, token!).subscribe({
      next: () => {
        this.message = '✅ Brand added successfully!';
        this.brandForm.reset();
        this.back.emit();
      },
      error: (err) => {
        this.message = '❌ Brand add failed!';
      }
    });
  }

  onBackClick() {
    this.back.emit();
  }
}
