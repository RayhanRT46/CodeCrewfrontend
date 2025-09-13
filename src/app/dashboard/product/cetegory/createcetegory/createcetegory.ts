import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Cetegory } from '../cetegory';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-createcetegory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createcetegory.html',
  styleUrls: ['./createcetegory.css']
})
export class CreateCetegory {
  @Output() back = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private Service: ProductService) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      parentCategoryId: [null]
    });
  }
  categoryForm: FormGroup;
  message: string = '';
  token: string = '';
  categories: any[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.Service.GetCetegory().subscribe({
      next: (res) => this.categories = res,
      error: (err: HttpErrorResponse) => console.error('Failed to load categories', err)
    });
  }

  getCategoriesWithIndex() {
    return this.categories.map((cat, i) => ({ ...cat, idx: i }));
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.message = 'Please fill in required fields.';
      return;
    }
    const req = {
      categoryName: this.categoryForm.value.categoryName,
      parentCategoryId: this.categoryForm.value.parentCategoryId
    };

    this.Service.AddCetegory(req).subscribe({
      next: (res) => {
        this.message = `✅ Category "${res.categoryName}" created successfully!`;
        this.categoryForm.reset();
        this.back.emit();
      },
      error: (err: HttpErrorResponse) => {
        if (typeof err.error === 'string') {
          this.message = err.error;
        } else {
          this.message = err.error?.message || 'Something went wrong';
        }
      }

    });
  }

  onBackClick() {
    this.back.emit();
  }

}
