import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../user/service/login.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-registeruseradmin',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './registeruseradmin.html',
  styleUrl: './registeruseradmin.css'
})
export class Registeruseradmin {
  @Output() registered = new EventEmitter<void>();

  registerForm: FormGroup;
  roles = ['Admin', 'Seller', 'Customer'];
  message: string = '';

  constructor(private fb: FormBuilder, private userService: LoginService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [''],
      role: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) return;
    var showAddUser = true;
    const token = localStorage.getItem('adminToken');
    const data: Registeruseradmin = this.registerForm.value;

    this.userService.registerUserAdmin(data, token!).subscribe({
      next: () => {
        this.message = '✅ User registered successfully!';
        setTimeout(() => {
          this.registered.emit();
        }, 0);
      },
      error: () => {
        this.message = '❌ Registration failed!';
      }
    });
  }

}
