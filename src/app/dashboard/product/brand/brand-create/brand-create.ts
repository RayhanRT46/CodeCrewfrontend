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
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private service: ProductService) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      imageFile: [null, Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.brandForm.patchValue({ imageFile: file });
    }
  }

  onSubmit() {
    if (this.brandForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('Name', this.brandForm.get('name')?.value);
    formData.append('ImageFile', this.selectedFile);

    this.service.BrandAdd(formData).subscribe({
      next: () => {
        this.message = '✅ Brand added successfully!';
        this.brandForm.reset();
        this.selectedFile = null;
        this.back.emit();
      },
      error: () => {
        this.message = '❌ Brand add failed!';
      }
    });
  }

  onBackClick() {
    this.back.emit();
  }
}
