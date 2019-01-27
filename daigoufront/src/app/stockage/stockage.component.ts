import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../login-auth.service';
import { StockageService } from '../services/stockage.service';
import { ArticleStockage } from '../domain/articlestockage';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stockage',
  templateUrl: './stockage.component.html',
  styleUrls: ['./stockage.component.css']
})
export class StockageComponent implements OnInit {

  public loginuser: any = {};
  public stockages: any;
  public createArticleStockage: ArticleStockage = new ArticleStockage();

  constructor(private authService: LoginAuthService, private stockageService: StockageService) { 
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.stockageService.getAllStockage(this.loginuser.token).subscribe(stockages =>{
      this.stockages = stockages;
    });
  }

  creationArticleStockage(articlestockage: ArticleStockage) {
    console.log(articlestockage);
    this.stockageService.createArticleStockage(articlestockage, this.loginuser.token).subscribe(stockage =>{
      //this.stockages.push(stockage);
      this.stockageService.getAllStockage(this.loginuser.token).subscribe(stockages =>{
        this.stockages = stockages;
      });
    })
  }

  validatorBtnCreate(articlestockage: ArticleStockage) {
    let isEnabled = true;
    if(articlestockage.nameArticleStockage == null || articlestockage.nameArticleStockage == ""){
      isEnabled = false;
    }
    if(articlestockage.countStockageChine == 0 && articlestockage.countStockageEnRoute == 0 && articlestockage.countStockageFrance == 0){
      isEnabled = false;
    }
    return isEnabled;
  }
}
