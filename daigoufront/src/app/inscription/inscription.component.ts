import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { LoginAuthService } from '../login-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  public user: any = {};

  constructor(private router: Router, private userService:  UserService, private authService: LoginAuthService) { 
    this.authService.isLoggedIn();
  }

  ngOnInit() {
  }

  inscription(user:any, userForm: any){
    user.enabled = true;
    user.role = "USER";
    this.userService.inscription(user).subscribe((response) => {
      if(response){
        console.log(response);
        userForm.reset();
        this.router.navigate(['/login']);
      }
    })
  }
}
