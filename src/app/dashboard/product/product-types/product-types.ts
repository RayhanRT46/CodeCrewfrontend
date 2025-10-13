import { Component } from '@angular/core';
import { productTypeModel } from './productTypeModel';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-types',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-types.html',
  styleUrls: ['./product-types.css', '../common.css']
})
export class ProductTypes {
  public dataList: productTypeModel[] = [];
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  constructor(public service: ProductService) { 
  }
  
  ngOnInit(): void {
    this.loadProductTypes();
  }

loadProductTypes() {
  this.service.GetProductType().subscribe({
    next: (data) => {
      this.dataList = data;
    },
    error: () => {
      this.message = "Please try agine";
      this.messageType = 'error';
    }
  })
}

//Delete Product Type
DeleteBrand(id: number) {
  if (confirm('Are you Delete this?')) {
    this.service.DeleteProductType(id).subscribe(
      {
        next: () => {
          this.message = "Delete successfull";
          this.messageType = 'success';
          this.loadProductTypes();
        },
        error: (err) => {
          this.message = "Delete failed";
          this.messageType = 'error';
        }
      })
  }
}
//Update Product Type
editingUserId: number | null = null;
startEdit(userId: number) {
  this.editingUserId = userId;
}

saveEdit(data: any) {
  debugger
  this.service.UpdateProductType(data.id, data).subscribe({
    next: () => {
      this.message = '✅ User updated successfully!';
      this.messageType = 'success';
      this.editingUserId = null;
      this.loadProductTypes(); // refresh list
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
