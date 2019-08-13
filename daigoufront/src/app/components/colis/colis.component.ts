import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Colis } from '../../domain/colis';
import { LoginAuthService } from '../../login-auth.service';
import { ColisService } from '../../services/colis.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modal/modal.component';
import { EnumStatusColis } from '../../common/enum/enumstatuscolis';
import { StockageService } from 'src/app/services/stockage.service';
import { ArticleStockage } from 'src/app/domain/articlestockage';
import { Article } from 'src/app/domain/article';
import { EnumTypeCommande } from 'src/app/common/enum/enumtypecommande';

@Component({
  selector: 'app-colis',
  templateUrl: './colis.component.html',
  styleUrls: ['./colis.component.css']
})
export class ColisComponent implements OnInit {
  public loginuser: any = {};
  public newColis: Colis = new Colis();
  public statusList: any;
  public colisList: any;
  public statusColisSelect: any;
  public modal: any;
  public stockageList: ArticleStockage[];
  public newArticleStockage: any;
  public countArticleStockage: number;
  public countForCreateArticleStockageSelected: Array<number>;

  constructor(private authService: LoginAuthService, private colisService: ColisService, private stockageService: StockageService, private modalService: NgbModal, private modalComponent: ModalComponent) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.colisService.getColisStatus(this.loginuser.token).subscribe(statusList =>{
      this.statusList = statusList;
      console.log(statusList);
    })

    this.getColisByStatus(1);
    this.statusColisSelect = EnumStatusColis.COLIS_NON_ENVOYE;
    this.getAllStockage();
  }
  
  creationColis(colis: Colis){
    this.colisService.creationColis(colis, this.loginuser.token).subscribe(colis =>{
      this.newColis = new Colis();

      this.getColisByStatus(1);
      this.statusColisSelect = 1;
    })
  }

  getColisByStatus(status: any){
    this.colisService.getColisByStatus(status, this.loginuser.token).subscribe(colisList =>{
      console.log(colisList);
      this.colisList = colisList;
    })
  }

  envoyerColis(colis: Colis){
    const modalRef  = this.modal.openModal("common.warning", "message.confirmSend", "common.confirm");
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.colisService.envoyerColis(colis, this.loginuser.token).subscribe(colis =>{
        for(let c of this.colisList) {
          this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
        }
      })
    })
  }

  arriverColis(colis: Colis){
    const modalRef  = this.modal.openModal("common.warning", "message.confirmArrive", "common.confirm");
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.colisService.arriverColis(colis, this.loginuser.token).subscribe(colis =>{
        for(let c of this.colisList) {
          this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
        }
      })
    })
  }

  showBtnEnvoyer(colis: Colis){
    let isShow: boolean = false;
    if(colis.articles.length > 0 && colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      isShow = true;
    }
    return isShow;
  }

  getAllStockage(){
    this.stockageService.getAllStockage(this.loginuser.token).subscribe(stockageList =>{
      this.stockageList = stockageList;
    })
  }

  putArticleStockageInColis(newArticleStockage, countArticleStockage, idColis){
    console.log("countArticleStockage : " + countArticleStockage);
    this.colisService.putArticleStockageInColis(newArticleStockage, countArticleStockage, idColis, this.loginuser.token).subscribe(article =>{
      for(let colis of this.colisList) {
        if(colis.idColis == idColis){
          colis.articles.push(article)
        }
      }

      newArticleStockage = null;
    })
  }

  changetCreateArticleStockageSelected(stockage: any){
    this.countForCreateArticleStockageSelected = [];

    if(stockage != null){
      for(let i = 1; i <= stockage.countStockageFrance; i++){
        this.countForCreateArticleStockageSelected.push(i);
      }
    }
  }

  removeArticleStockage(article: Article, index: number, colis: Colis){
    const modalRef  = this.modal.openModal("common.warning", "message.confirmDelete", "common.delete");
    console.log(article);
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.colisService.deleteArticleFromColis(article, this.loginuser.token).subscribe(res =>{
        for(let a of colis.articles) {
          if(a.typeArticle.index == EnumTypeCommande.COMMANDE_STOCKAGE && a.idArticle == article.idArticle){
            colis.articles = colis.articles.filter(x => x !== article);
          }
        }
      })
    })
  }

  isAllowAddFromStockage(){
    if(this.newArticleStockage == null){
      return false;
    }else{
      return true;
    }
  }
}
