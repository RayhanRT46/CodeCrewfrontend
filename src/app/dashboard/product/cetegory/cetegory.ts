import { Component, signal } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryModel } from './cetegorydModel';

@Component({
  selector: 'app-cetegory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cetegory.html',
  styleUrl: './cetegory.css'
})
export class Cetegory {
  List = signal<CategoryModel[]>([]);
  route: any;
  editingUserId = signal<number | null>(null);
  message = signal<string | null>(null);
  messageType = signal<'success' | 'error'>('success');

  constructor(public service: ProductService) {}

  ngOnInit() {
    this.loadCetegory();
  }

  loadCetegory() {
    this.service.GetCetegory().subscribe({
      next: (data: any[]) => {
        this.List.set(data.map(item => new CategoryModel(
          item.id,
          item.categoryName,
          item.parentCategoryId ?? null,
          item.parentCategory ? new CategoryModel(
            item.parentCategory.id,
            item.parentCategory.categoryName,
            item.parentCategory.parentCategoryId ?? null,
            null,
            item.parentCategory.subCategories ?? []
          ) : null,
          item.subCategories ?? []
        )));
      },
      error: () => {
        this.message.set('Please try again');
        this.messageType.set('error');
      }
    });
  }

// Update Brand
editingCategory = signal<number | null>(null);


startEdit(categoryId: number) {
  this.editingCategory.set(categoryId);
}

saveEdit(data: any) {
const updateData = {
    id: data.id,
    categoryName: data.categoryName,
    parentCategoryId: data.parentCategoryId ?? 0
  };
  this.service.UpdateCetegory(updateData.id, updateData).subscribe({
    next: () => {
      this.message.set('✅ updated successfully!');
      this.messageType.set('success');
      this.editingCategory.set(null);
      this.loadCetegory();
      setTimeout(() => this.message.set(''), 1000);
    },
    error: (err) => {
      console.log(err);
      this.message.set(`❌ Failed to update (${err.status} ${err.statusText})`);
      this.messageType.set('error');
    }
  });
}
cancelEdit() {
  this.editingCategory.set(null);
}


DeleteCetegory(id: number) {
  if(confirm('Are you sure you want to delete this Category?')){
    this.service.DeleteCetegory(id).subscribe({
      next: (res: any) => {
        this.message.set(res.message); // API থেকে আসা message
        this.messageType.set('success');
        this.loadCetegory();
      },
      error: (err: any) => {
        this.message.set(err.error?.message || 'Something went wrong, try again');
        this.messageType.set('error');
      }
    })
  }
}
    
}
