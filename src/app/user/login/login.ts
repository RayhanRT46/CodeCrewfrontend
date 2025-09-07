import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';   // message variable
  isError: boolean = false; // success or error differentiate

  constructor(private authService: LoginService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.authService.saveAuthData(res.token, res.user);
        this.message = 'Login successful!';
        this.isError = false;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: () => {
        this.message = 'Invalid email or password';
        this.isError = true;
      }
    });
    
  }
}
