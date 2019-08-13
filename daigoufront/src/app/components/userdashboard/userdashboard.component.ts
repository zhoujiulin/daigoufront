import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../../login-auth.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {

  public loginuser: any = {};
  public user: any = [];

  constructor(private authService: LoginAuthService, private userService: UserService, private router: Router) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.userService.getUser(this.loginuser.token).subscribe(user =>{
      this.user = user;
    })
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }
}
