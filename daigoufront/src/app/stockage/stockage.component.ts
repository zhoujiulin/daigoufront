import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../login-auth.service';
import { StockageService } from '../services/stockage.service';
import { ArticleStockage } from '../domain/articlestockage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../common/modal/modal/modal.component';

@Component({
  selector: 'app-stockage',
  templateUrl: './stockage.component.html',
  styleUrls: ['./stockage.component.css']
})
export class StockageComponent implements OnInit {

  public modal: any;
  public loginuser: any = {};
  public stockages: any;
  public createArticleStockage: ArticleStockage = new ArticleStockage();

  constructor(private authService: LoginAuthService, private stockageService: StockageService, private modalService: NgbModal, private modalComponent: ModalComponent) { 
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.stockageService.getAllStockage(this.loginuser.token).subscribe(stockages =>{
      this.stockages = stockages;
    });
  }

  creationArticleStockage(articleStockage: ArticleStockage) {
    this.stockageService.createArticleStockage(articleStockage, this.loginuser.token).subscribe(stockage =>{
      //this.stockages.push(stockage);
      this.stockageService.getAllStockage(this.loginuser.token).subscribe(stockages =>{
        this.stockages = stockages;
      });
    })
  }

  editArticleStockage(articleStockage: ArticleStockage){
    articleStockage.isOnEdit = true;
    for(let stockage of this.stockages){
      stockage.isNotToEdit = true;
      if(articleStockage.idArticleStockage != stockage.idArticleStockage){
        stockage.isOnEdit = false;
      }
    }
  }

  cancelEditArticleStockage(articleStockage: ArticleStockage){

    this.stockageService.getArticleStockageById(articleStockage.idArticleStockage, this.loginuser.token).subscribe(stockage =>{
      articleStockage.countStockageChine = stockage['countStockageChine'];
      articleStockage.countStockageEnRoute = stockage['countStockageEnRoute'];
      articleStockage.countStockageFrance = stockage['countStockageFrance'];
      articleStockage.nameArticleStockage = stockage['nameArticleStockage'];
      articleStockage.priceAchatStockage = stockage['priceAchatStockage'];
    });

    articleStockage.isOnEdit = false;
    for(let stockage of this.stockages){
      stockage.isNotToEdit = false;
    }
  }

  saveArticleStockage(articleStockage: ArticleStockage){
    let isArticleStorageExists = false;
    for(let s of this.stockages){
      if((s.nameArticleStockage == articleStockage.nameArticleStockage) && (s.idArticleStockage != articleStockage.idArticleStockage)){
        isArticleStorageExists = true;
      }
    }

    if(!isArticleStorageExists){
      this.stockageService.saveArticleStockage(articleStockage, this.loginuser.token).subscribe(s =>{
        articleStockage.isOnEdit = false;
        for(let stockage of this.stockages){
          stockage.isNotToEdit = false;
        }
      })
    }else{
      const modalRef  = this.modal.openModal("common.warning", "message.nameArticleAlreadyExistes", "common.confirm");
      modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        
      })
    }
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
