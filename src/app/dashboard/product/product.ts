import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './service/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class Product {

  }
