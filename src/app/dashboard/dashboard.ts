import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { AllUsers } from "./user/all-users/all-users";
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Registeruseradmin } from "./user/registeruseradmin/registeruseradmin";
import { Brand } from './product/brand/brand';
import { BrandCreate } from './product/brand/brand-create/brand-create';
import { Product } from "./product/product";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, AllUsers, RouterModule, Registeruseradmin, Brand, BrandCreate, Product],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  activeMenu: string = '';
  showAddUser: boolean = false;

  // Inject Router and ActivatedRoute
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
        const urlParts = this.router.url.split('/');
        this.activeMenu = urlParts[2] || '';
        this.showAddUser = urlParts[3] === 'add';
  }

  // Void for deshboard router
  onMenuClick(menu: string) {
  this.activeMenu = menu;
  this.showAddUser = false;
  if (this.router.url !== `/dashboard/${menu}`) {
    this.router.navigate(['/dashboard', menu]);
  }
}

//Void for New User Create
  onAddUserClick() {
    this.showAddUser = true;
    this.router.navigate(['/dashboard', 'users', 'add']);
  }
  onUserRegistered() {
    this.showAddUser = false;
    this.router.navigate(['/dashboard', 'users']);
  }

  //Void for New User Create
  onAddBrandClick() {
    this.showAddUser = true;
    this.router.navigate(['/dashboard', 'brand', 'add']);
  }

  
}
