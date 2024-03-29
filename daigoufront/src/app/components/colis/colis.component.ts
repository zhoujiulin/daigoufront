import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Colis } from '../../domain/colis';
import { LoginAuthService } from '../../login-auth.service';
import { ColisService } from '../../services/colis.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modalcommon/modal.component';
import { ModalArriverColisComponent } from 'src/app/common/modal/modalarrivercolis/modalarrivercolis.component';
import { EnumStatusColis } from '../../common/enum/enumstatuscolis';
import { StockageService } from 'src/app/services/stockage.service';
import { ArticleStockage } from 'src/app/domain/articlestockage';
import { Article } from 'src/app/domain/article';
import { EnumTypeCommande } from 'src/app/common/enum/enumtypecommande';
import { EnumTypeArticle } from 'src/app/common/enum/enumtypearticle';

@Component({
  selector: 'app-colis',
  templateUrl: './colis.component.html',
  styleUrls: ['./colis.component.css']
})
export class ColisComponent implements OnInit {
  public loginuser: any = {};
  public modal: any;
  public modalArriverColis: any;

  public statusList: any;
  public colisList: any;
  public statusColisSelect: any;
  public stockageList: ArticleStockage[];
  public newArticleStockage: ArticleStockage  = new ArticleStockage();
  public countArticleStockage: number;
  public countForCreateArticleStockageSelected: Array<number>;

  constructor(private authService: LoginAuthService, private colisService: ColisService, private stockageService: StockageService, private modalService: NgbModal, 
    private modalComponent: ModalComponent, private modalArriverColisComponent: ModalArriverColisComponent) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
    this.modalArriverColis = modalArriverColisComponent;
  }

  ngOnInit() {
    this.colisService.getColisStatus(this.loginuser.token).subscribe(statusList =>{
      this.statusList = statusList;
    })

    this.statusColisSelect = EnumStatusColis.COLIS_NON_ENVOYE;
    this.getColisByStatus(this.statusColisSelect);
    this.getAllStockage();
  }
  
  creationNewColis(){
    this.colisService.creationNewColis(this.loginuser.token).subscribe(colis =>{
      this.getColisByStatus(EnumStatusColis.COLIS_NON_ENVOYE);
      this.statusColisSelect = EnumStatusColis.COLIS_NON_ENVOYE;
    })
  }

  getColisByStatus(status: any){
    this.colisService.getColisByStatus(status, this.loginuser.token).subscribe(colisList =>{
      this.colisList = colisList;

      for(let colis of this.colisList){
        this.initCountArticleColis(colis);
      }

      console.log(this.colisList);
    })
  }

  initCountArticleColis(colis: Colis){
    colis.countArticleInColis = 0;
    for(let article of colis.articles){
      if(article.typeArticle.index == EnumTypeArticle.ARTICLE_CLIENT){
        colis.countArticleInColis = Number(colis.countArticleInColis) + Number(article.countArticleAchete) + Number(article.countArticleFromStockageFrance);
      }
      if(article.typeArticle.index == EnumTypeArticle.ARTICLE_STOCKAGE){
        colis.countArticleInColis = Number(colis.countArticleInColis) + Number(article.count);
      }
    }
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
    const modalRef  = this.modalArriverColis.openModal("common.warning", "message.confirmArrive", "common.confirm", colis);
    modalRef.componentInstance.passEntry.subscribe((articleMapEnRoutes) => {
      this.colisService.arriverColis(articleMapEnRoutes, this.loginuser.token).subscribe(colis =>{
        console.log(colis);
        for(let c of this.colisList) {
          this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
        }
      })
    })

  }

  getAllStockage(){
    this.stockageService.getAllStockageSelectable(this.loginuser.token).subscribe(stockageList =>{
      this.stockageList = stockageList;
    })
  }

  putArticleStockageInColis(newArticleStockage, countArticleStockage, colis){
    this.colisService.putArticleStockageInColis(newArticleStockage, countArticleStockage, colis.idColis, this.loginuser.token).subscribe(article =>{
      for(let c of this.colisList) {
        if(c.idColis == colis.idColis){
          c.articles = c.articles.filter(a => (a.nameArticle !== newArticleStockage.nameArticleStockage || a.typeArticle.index == EnumTypeArticle.ARTICLE_CLIENT));
          c.articles.push(article)
        }
      }

      newArticleStockage.countStockageFranceAvailable = newArticleStockage.countStockageFranceAvailable - countArticleStockage;
      newArticleStockage.countStockageFranceColis = newArticleStockage.countStockageFranceColis + countArticleStockage;

      this.newArticleStockage = new ArticleStockage();
      this.changetCreateArticleStockageSelected(this.newArticleStockage); 

      this.initCountArticleColis(colis);
    })
  }

  changetCreateArticleStockageSelected(stockage: any){
    this.countForCreateArticleStockageSelected = [];

    if(stockage != null){
      for(let i = 1; i <= stockage.countStockageFranceAvailable; i++){
        this.countForCreateArticleStockageSelected.push(i);
      }
    }
  }

  removeArticleStockage(article: Article, index: number, colis: Colis){
    const modalRef  = this.modal.openModal("common.warning", "message.confirmDelete", "common.delete");
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

  deleteColis(colis: Colis){
    this.colisService.deleteColis(colis.idColis, this.loginuser.token).subscribe(res =>{
      this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
    })
  }

  isAllowAddFromStockage(){
    if(this.newArticleStockage == null){
      return false;
    }else{
      return true;
    }
  }

  showBtnEnvoyer(colis: Colis){
    let isShow: boolean = false;
    if(colis.articles.length > 0 && colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      isShow = true;
    }
    return isShow;
  }

  showBtnDelete(colis: Colis){
    let isShow = false;
    if((colis.articles == null || colis.articles.length == 0) && colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      isShow = true;
    }
    return isShow;
  }

  isColisNonEnvoyee(colis: Colis){
    if(colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      return true;
    }
    return false;
  }

  isShowArticleStockage(colis: Colis){
    let isShowArticleStockage = false;
    for(let article of colis.articles){
      if(article.typeArticle.index == EnumTypeArticle.ARTICLE_STOCKAGE){
        isShowArticleStockage = true;
      }
    }

    if(colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      isShowArticleStockage = true;
    }

    return isShowArticleStockage;
  }
}
