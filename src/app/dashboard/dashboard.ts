import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { AllUsers } from "./user/all-users/all-users";
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Registeruseradmin } from "./user/registeruseradmin/registeruseradmin";
import { Brand } from './product/brand/brand';
import { BrandCreate } from './product/brand/brand-create/brand-create';
import { Product } from "./product/product";
import { Cetegory } from "./product/cetegory/cetegory";
import { CreateCetegory } from "./product/cetegory/createcetegory/createcetegory";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, AllUsers, RouterModule, Registeruseradmin, Brand, BrandCreate, Product, Cetegory, CreateCetegory],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  activeMenu: string = '';
  activeAddSection: string = ''; // 'users', 'brand', 'cetegory', 'product'

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const urlParts = this.router.url.split('/');
    this.activeMenu = urlParts[2] || '';
    this.activeAddSection = urlParts[3] || '';
  }

  onMenuClick(menu: string) {
    this.activeMenu = menu;
    this.activeAddSection = '';
    if (this.router.url !== `/dashboard/${menu}`) {
      this.router.navigate(['/dashboard', menu]);
    }
  }

  // ================== Users ==================
  AddUserRoute() {
    this.activeAddSection = 'users';
    this.router.navigate(['/dashboard', 'users', 'add']);
  }

  backUserRoute() {
    this.activeAddSection = '';
    this.router.navigate(['/dashboard', 'users']);
  }

  // ================== Brand ==================
  AddBrandRoute() {
    this.activeAddSection = 'brand';
    this.router.navigate(['/dashboard', 'brand', 'add']);
  }

  backBrandRoute() {
    this.activeAddSection = '';
    this.router.navigate(['/dashboard', 'brand']);
  }

  // ================== Category ==================
  AddCetegoryRoute() {
    this.activeAddSection = 'cetegory';
    this.router.navigate(['/dashboard', 'cetegory', 'add']);
  }

  backCetegoryRoute() {
    this.activeAddSection = '';
    this.router.navigate(['/dashboard', 'cetegory']);
  }

  // ================== Product ==================
  AddProductRoute() {
    this.activeAddSection = 'product';
    this.router.navigate(['/dashboard', 'product', 'add']);
  }

  backProductRoute() {
    this.activeAddSection = '';
    this.router.navigate(['/dashboard', 'product']);
  }
}
