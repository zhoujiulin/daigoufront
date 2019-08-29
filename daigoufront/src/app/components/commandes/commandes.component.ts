import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { LoginAuthService } from '../../login-auth.service';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../domain/commande';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../common/modal/modalcommon/modal.component';
import { Article } from '../../domain/article';
import { ColisService } from '../../services/colis.service';
import { EnumStatusCommande } from '../../common/enum/enumstatuscommande';
import { EnumStatusArticlePreparation } from '../../common/enum/enumstatusarticlepreparation';
import { NgModel, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumTypeArticle } from 'src/app/common/enum/enumtypearticle';
import { EnumTypeCommande } from 'src/app/common/enum/enumtypecommande';
import { ArticleStockage } from 'src/app/domain/articlestockage';
import { StockageService } from 'src/app/services/stockage.service';
import { EnumStatusArticle } from 'src/app/common/enum/enumstatusarticle';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})

export class CommandesComponent implements OnInit {

  public loginuser: any = {};
  public colisList: any;
  public statusList = new Map<number, string>();
  public statusGroupList = new Map<number[], string>();
  public commandes: any;
  public modal: any;
  public statusCommandeSelect: any;
  
  public articleStockageList: ArticleStockage[];
  public filteredOptions: ArticleStockage[];

  public countArticleStockageFranceSelectedMap = new Map<string, number>();
  public countArticleStockageChineSelectedMap = new Map<string, number>();
  public countArticleStockageEnRouteSelectedMap = new Map<string, number>();

  constructor(private authService: LoginAuthService, private commandeService: CommandeService, private stockageService: StockageService, 
    private colisService: ColisService, private modalService: NgbModal, private modalComponent: ModalComponent, private translateService: TranslateService) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.commandeService.getCommandeStatusGroup(this.loginuser.token).subscribe(statusGroupList =>{
      this.statusGroupList = statusGroupList;

      this.initCommandesByStatus();
    })

    this.commandeService.getCommandeStatus(this.loginuser.token).subscribe(statusList =>{
      this.statusList = statusList;
    })

    this.colisService.getColisByStatus(1, this.loginuser.token).subscribe(colisList =>{
      this.colisList = colisList;
    })  

    this.statusCommandeSelect = [EnumStatusCommande.ERREUR_IN_COMMANDE, EnumStatusCommande.NEW_COMMANDE, EnumStatusCommande.COMMANDE_PARTIE_PRET, 
      EnumStatusCommande.COMMANDE_PARTIE_PRET_A_ENVOYER, EnumStatusCommande.COMMANDE_PRET_A_ENVOYER];
  }

  initCommandesByStatus(){
    EnumStatusCommande.NEW_COMMANDE
    let commandeNonEnvoyee: number[] = [EnumStatusCommande.ERREUR_IN_COMMANDE, EnumStatusCommande.NEW_COMMANDE, EnumStatusCommande.COMMANDE_PARTIE_PRET, EnumStatusCommande.COMMANDE_PARTIE_PRET_A_ENVOYER, EnumStatusCommande.COMMANDE_PRET_A_ENVOYER];
    this.getCommandesByStatus(commandeNonEnvoyee);
  }

  getCommandesByStatus(status: any) {
    this.commandeService.getCommandesByStatus(this.loginuser.token, status).subscribe(commandes =>{
      this.commandes = commandes;

      this.getAllStockage();
      this.initCountSelectStockage();
      console.log(this.commandes);
    })
  }

  updateCommande(commande: Commande) {
    this.commandeService.updateCommande(this.loginuser.token, commande).subscribe(res =>{
      let itemIndex = this.commandes.findIndex(c => c.id == res['id']);
      this.commandes[itemIndex] = res;

      this.initCountSelectStockage();
    })
  }

  supprimerCommandeConfirm(commande: Commande) {
    const modalRef  = this.modal.openModal("common.warning", "message.confirmDelete", "common.delete");

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.supprimerCommande(commande);
    })
  }

  supprimerCommande(commande: Commande) {
    this.commandes = this.commandes.filter(c => c.id !== commande.id); 

    this.commandeService.supprimerCommande(this.loginuser.token, commande).subscribe(res =>{
    })
  }

  supprimerArticleConfirm(article: Article, commande: Commande) {
    const modalRef  = this.modal.openModal("common.warning", "message.confirmDelete", "common.delete");

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.supprimerArticle(article, commande);
    })
  }

  supprimerArticle(article: Article, commande: Commande) {
    for(let c of this.commandes) {
      if(c.id == commande.id){
        c.articles = c.articles.filter(a => a !== article);
      }
    }

    this.initCountSelectStockage();
  }

  addArticle(commande: Commande){
    for(let c of this.commandes) {
      if(c.id == commande.id){
        let article = new Article();
        article.count = 0;
        article.countArticleAchete = 0;
        article.countArticleFromStockageFrance = 0;
        article.countArticleFromStockageEnRoute = 0;
        article.countArticleFromStockageChine = 0;
        c.articles.push(article);
      }
    }
  }

  validatorBtnSave(commande: Commande) {
    let isDisabled = false;

    for(let article of commande.articles){
      if(article.nameArticle == null || article.nameArticle == "") {
        isDisabled = true;
      }
      if(article.count == null || article.count <= 0) {
        isDisabled = true;
      }
    }
    return isDisabled;
  }

  disabledSelectColis(article: Article) {
    let isDisabled = false;
    if(article.statusArticlePreparation != null && (article.statusArticlePreparation['index']== 2 || article.statusArticlePreparation['index'] == 3)){
      isDisabled = true;
    }
    return isDisabled;
  }

  compareColis(o1: Object, o2: Object): boolean {
      return o1 && o2 ? o1['idColis'] === o2['idColis'] : o1 === o2;
  }

  compareCount(o1: Object, o2: Object): boolean{
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }

  onlyShowPourCommandeNonEnvoyee(index: number){
    if(index == EnumStatusCommande.NEW_COMMANDE 
      || index == EnumStatusCommande.COMMANDE_PARTIE_PRET 
      || index == EnumStatusCommande.COMMANDE_PARTIE_PRET_A_ENVOYER
      || index == EnumStatusCommande.COMMANDE_PRET_A_ENVOYER
      || index == EnumStatusCommande.ERREUR_IN_COMMANDE){
        return true;
    }else{
      return false;
    }
  }

  isArticleArrive(article: Article){
    if(article.statusArticle == null) {
      return false;
    }
    if(article.statusArticle.index == EnumStatusArticle.ARTICLE_NON_ENVOYE || article.statusArticle.index == EnumStatusArticle.ARTICLE_ENVOYE_SUR_LA_ROUTE){
      console.log(article.statusArticle);
      return false;
    }
    return true;
  }

  changeColis(article: Article, ngModelSelectColis: NgModel){
    ngModelSelectColis.control.markAsTouched();
    if(article.colis != null && article.statusArticlePreparation != null && article.statusArticlePreparation.index == EnumStatusArticlePreparation.PREPARE_PARTIE){
      this.modal.openModal("common.warning", "message.confirmSendForArticlePreparePartie", "common.confirm");
    }
  }

  isArticleClient(article: Article){
    if(article.typeArticle == null || article.typeArticle.index == EnumTypeArticle.ARTICLE_CLIENT){
      return true;
    }
    return false;
  }

  isCommandeStockage(commande: Commande){
    if(commande.typeCommande.index == EnumTypeCommande.COMMANDE_STOCKAGE){
      return true;
    }
    return false;
  }

  getAllStockage(){
    this.stockageService.getAllStockage(this.loginuser.token).subscribe((response) => {
      this.articleStockageList = response;
      this.filteredOptions = this.articleStockageList;
    })
  }

  displayFn(nameArticleStockage?: string): string | undefined {
    return nameArticleStockage;
  }

  private _filter(value: string): ArticleStockage[] {
    const filterValue = this._normalizeValue(value);
    return this.articleStockageList.filter(a => this._normalizeValue(a.nameArticleStockage).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onEnterNameArticle(evt: any){
  }

  changeNameArticle(event: any, article: Article){
    this.filteredOptions = this._filter(event);

    if(event !== null && event !== ""){
      this.getArticleStockageByName(event, article, true, true, true);
    }
  }

  getArticleStockageByName(name: string, article: Article, isStockageFrance: boolean, isStockageChine: boolean, isStockageEnRoute: boolean){
    this.stockageService.getArticleStockageByName(name, this.loginuser.token).subscribe((articleStockge) => {
      if(isStockageFrance){
        this.initSelectStockageFrance(articleStockge, article, name);
      }
      if(isStockageChine){
        this.initSelectStockageChine(articleStockge, article, name);
      }
      if(isStockageEnRoute){
        this.initSelectStockageEnRoute(articleStockge, article, name);
      }
    })
  }

  initSelectStockageFrance(articleStockge: any, article: Article, name: string){
    if(articleStockge != null){
      if(article.countArticleFromStockageFranceSelectable == null){
        article.countArticleFromStockageFranceSelectable = [];
      }

      let countDispo = articleStockge['countStockageFranceAvailable'];
      let countSelected = this.countArticleStockageFranceSelectedMap.get(name);
      if(countSelected == null){
        countSelected = 0;
      }

      countDispo = Number(countDispo) - Number(countSelected) + Number(article.countArticleFromStockageFrance);
      article.countArticleFromStockageFranceSelectable = [];
      for(let i = 1; i <= countDispo; i++){
        article.countArticleFromStockageFranceSelectable.push(i);
      }
    }else{
      article.countArticleFromStockageFranceSelectable = [];
    }
  }

  initSelectStockageChine(articleStockge: any, article: Article, name: string){
    if(articleStockge != null){
      if(article.countArticleFromStockageChineSelectable == null){
        article.countArticleFromStockageChineSelectable = [];
      }

      let countDispo = articleStockge['countStockageChine'];
      let countSelected = this.countArticleStockageChineSelectedMap.get(name);
      if(countSelected == null){
        countSelected = 0;
      }

      countDispo = Number(countDispo) - Number(countSelected) + Number(article.countArticleFromStockageChine);
      article.countArticleFromStockageChineSelectable = [];
      for(let i = 1; i <= countDispo; i++){
        article.countArticleFromStockageChineSelectable.push(i);
      }
    }else{
      article.countArticleFromStockageChineSelectable = [];
    }
  }

  initSelectStockageEnRoute(articleStockge: any, article: Article, name: string){
    if(articleStockge != null){
      if(article.countArticleFromStockageEnRouteSelectable == null){
        article.countArticleFromStockageEnRouteSelectable = [];
      }

      let countDispo = articleStockge['countStockageEnRoute'];
      let countSelected = this.countArticleStockageEnRouteSelectedMap.get(name);
      if(countSelected == null){
        countSelected = 0;
      }

      countDispo = Number(countDispo) - Number(countSelected) + Number(article.countArticleFromStockageEnRoute);
      article.countArticleFromStockageEnRouteSelectable = [];
      for(let i = 1; i <= countDispo; i++){
        article.countArticleFromStockageEnRouteSelectable.push(i);
      }
    }else{
      article.countArticleFromStockageEnRouteSelectable = [];
    }
  }

  initCountSelectStockage(){
    this.initCountSelectedMap(null, null, true, true, true);

    for(let commande of this.commandes){
      for(let article of commande.articles){
        this.getArticleStockageByName(article.nameArticle, article, true, true, true);
      }
    }
  }

  initCountSelectedMap(a: Article, count: number, isStockageFrance: boolean, isStockageChine: boolean, isStockageEnRoute: boolean){
    if(isStockageFrance){
      this.countArticleStockageFranceSelectedMap = new Map<string, number>();
    }
    if(isStockageChine){
      this.countArticleStockageChineSelectedMap = new Map<string, number>();
    }
    if(isStockageEnRoute){
      this.countArticleStockageEnRouteSelectedMap = new Map<string, number>();
    }

    for(let commande of this.commandes){
      for(let article of commande.articles){
        if(isStockageFrance){
          if(this.countArticleStockageFranceSelectedMap.get(article.nameArticle) == null){
            if(a != null && article.idArticle == a.idArticle){
              this.countArticleStockageFranceSelectedMap.set(article.nameArticle, count);
            }else{
              this.countArticleStockageFranceSelectedMap.set(article.nameArticle, article.countArticleFromStockageFrance);
            }
          }else{
            if(a != null && article.idArticle == a.idArticle){
              let countSelected = Number(this.countArticleStockageFranceSelectedMap.get(article.nameArticle)) + Number(count);
              this.countArticleStockageFranceSelectedMap.set(article.nameArticle, countSelected);
            }else{
              let countSelected = Number(this.countArticleStockageFranceSelectedMap.get(article.nameArticle)) + Number(article.countArticleFromStockageFrance);
              this.countArticleStockageFranceSelectedMap.set(article.nameArticle, countSelected);
            }
          }
        }

        if(isStockageChine){
          if(this.countArticleStockageChineSelectedMap.get(article.nameArticle) == null){
            if(a != null && article.idArticle == a.idArticle){
              this.countArticleStockageChineSelectedMap.set(article.nameArticle, count);
            }else{
              this.countArticleStockageChineSelectedMap.set(article.nameArticle, article.countArticleFromStockageChine);
            }
          }else{
            if(a != null && article.idArticle == a.idArticle){
              let countSelected = Number(this.countArticleStockageChineSelectedMap.get(article.nameArticle)) + Number(count);
              this.countArticleStockageChineSelectedMap.set(article.nameArticle, countSelected);
            }else{
              let countSelected = Number(this.countArticleStockageChineSelectedMap.get(article.nameArticle)) + Number(article.countArticleFromStockageChine);
              this.countArticleStockageChineSelectedMap.set(article.nameArticle, countSelected);
            }
          }
        }
        
        if(isStockageEnRoute){
          if(this.countArticleStockageEnRouteSelectedMap.get(article.nameArticle) == null){
            if(a != null && article.idArticle == a.idArticle){
              this.countArticleStockageEnRouteSelectedMap.set(article.nameArticle, count);
            }else{
              this.countArticleStockageEnRouteSelectedMap.set(article.nameArticle, article.countArticleFromStockageEnRoute);
            }
          }else{
            if(a != null && article.idArticle == a.idArticle){
              let countSelected = Number(this.countArticleStockageEnRouteSelectedMap.get(article.nameArticle)) + Number(count);
              this.countArticleStockageEnRouteSelectedMap.set(article.nameArticle, countSelected);
            }else{
              let countSelected = Number(this.countArticleStockageEnRouteSelectedMap.get(article.nameArticle)) + Number(article.countArticleFromStockageEnRoute);
              this.countArticleStockageEnRouteSelectedMap.set(article.nameArticle, countSelected);
            }
          }
        }
      }
    }
  }

  changeSelectCountArticleFromStockageFrance(a: Article, count: number){
    this.initCountSelectedMap(a, count, true, false, false);
    for(let commande of this.commandes){
      for(let article of commande.articles){
        if(article.nameArticle == a.nameArticle){
          this.getArticleStockageByName(article.nameArticle, article, true, false, false);
        }
      }
    }
  }

  changeSelectCountArticleFromStockageChine(a: Article, count: number){
    this.initCountSelectedMap(a, count, false, true, false);
    for(let commande of this.commandes){
      for(let article of commande.articles){
        if(article.nameArticle == a.nameArticle){
          this.getArticleStockageByName(article.nameArticle, article, false, true, false);
        }
      }
    }
  }

  changeSelectCountArticleFromStockageEnRoute(a: Article, count: number){
    this.initCountSelectedMap(a, count, false, false, true);
    for(let commande of this.commandes){
      for(let article of commande.articles){
        if(article.nameArticle == a.nameArticle){
          this.getArticleStockageByName(article.nameArticle, article, false, false, true);
        }
      }
    }
  }
}
