import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Login } from './user/login/login';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './user/service/login.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LoginService
  ]
})
export class App {
  isLoggedIn = false;
  userName: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private modalService: NgbModal, public authService: LoginService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.fullName;
    }
  }

  openLogin() {
    const modalRef = this.modalService.open(Login, { centered: true, size: 'md' });
    modalRef.result.then((result) => {
      if (result && result.success) {
        this.isLoggedIn = true;
        this.userName = result.userName;
      }
    }).catch(() => {});
  }

  logout() {
    this.authService.logout(); // logout service call
    this.isLoggedIn = false;
    this.userName = '';
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      const now = new Date().getTime();
      const expTime = expirationDate!.getTime() - now;

      if (expTime > 0) {
        setTimeout(() => {
          this.authService.logout();
        }, expTime);
      } else {
        this.authService.logout();
      }
    }
  }
  
}

