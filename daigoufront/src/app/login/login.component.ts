import { Component, OnInit, Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { LoginAuthService } from '../login-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent implements OnInit {

public user: any = {};

  constructor(private userService: UserService, private router: Router, private authService: LoginAuthService) {
    this.authService.isLoggedIn();
  }

  ngOnInit() {

  }

  login(user: any){
    this.userService.login(user).subscribe((response) => {
      if(response){
        if(response.token){
          localStorage.setItem('currentUser', JSON.stringify(response));
          if(response.utilisateur.role === 'ADMIN'){
            this.router.navigate(['/admindashboard']);
          }else{
            this.router.navigate(['/userdashboard']);
          }
        }
      }
    });
  }
}