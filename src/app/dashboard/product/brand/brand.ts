import { Component } from '@angular/core';
import { BrandModel } from './brandModel';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand.html',
  styleUrl: './brand.css'
})
export class Brand {
  public brandList: BrandModel[] = [];
  route: any;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  constructor(public service: ProductService, route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.loadBrand();
  }

loadBrand() {
  this.service.GetBrand().subscribe({
    next: (data) => {
      this.brandList = data;
    },
    error: (err) => {
      this.message = "Please try agine";
      this.messageType = 'error';
    }
  })
}

//Delete Brand
DeleteBrand(id: number) {
  if (confirm('Are you Delete this Brand?')) {
    this.service.Deletebrand(id).subscribe(
      {
        next: () => {
          this.message = "Delete successfull";
          this.messageType = 'success';
          this.loadBrand();
        },
        error: (err) => {
          this.message = "Delete failed";
          this.messageType = 'error';
        }
      })
  }
}


//Update Brand
editingUserId: number | null = null;
startEdit(userId: number) {
  this.editingUserId = userId;
}

saveEdit(brand: any) {
  this.service.UpdateBrand(brand.id, brand).subscribe({
    next: () => {
      this.message = '✅ User updated successfully!';
      this.messageType = 'success';
      this.editingUserId = null;
      this.loadBrand(); // refresh list
      setTimeout(() => this.message = '', 1000);
    },
  error: (err) => {
    console.log(err);
    this.message = `❌ Failed to update user! (${err.status} ${err.statusText})`;
  }
  });
}

cancelEdit() {
  this.editingUserId = null;
}


}
