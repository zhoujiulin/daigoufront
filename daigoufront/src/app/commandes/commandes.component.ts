import { Component, OnInit, Injectable } from '@angular/core';
import { LoginAuthService } from '../login-auth.service';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../domain/commande';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../common/modal/modal/modal.component';
import { Article } from '../domain/article';
import { ColisService } from '../services/colis.service';

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
  public articleStatusList: any;
  public commandes: any;
  public modal: any;

  constructor(private authService: LoginAuthService, private commandeService: CommandeService, private colisService: ColisService, private modalService: NgbModal, private modalComponent: ModalComponent) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.commandeService.getCommandeStatusGroup(this.loginuser.token).subscribe(statusGroupList =>{
      this.statusGroupList = statusGroupList;

      this.getCommandesByStatus("1,2,3,4");
    })

    this.commandeService.getCommandeStatus(this.loginuser.token).subscribe(statusList =>{
      this.statusList = statusList;
    })

    this.commandeService.getArticleStatus(this.loginuser.token).subscribe(articleStatusList =>{
      this.articleStatusList = articleStatusList;
    })

    this.colisService.getColisByStatus(1, this.loginuser.token).subscribe(colisList =>{
      this.colisList = colisList;
    })
  }

  getCommandesByStatus(status: any) {
    this.commandeService.getCommandesByStatus(this.loginuser.token, status).subscribe(commandes =>{
      console.log(commandes);
      this.commandes = commandes;
    })
  }

  updateCommande(commande: Commande) {
    this.commandeService.updateCommande(this.loginuser.token, commande).subscribe(res =>{
      let itemIndex = this.commandes.findIndex(c => c.id == res['id']);
      this.commandes[itemIndex] = res;
    })
  }

  supprimerCommandeConfirm(commande: Commande) {
    const modalRef  = this.modal.openModal("Avertissement", "", "Supprimer");

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
    const modalRef  = this.modal.openModal("Avertissement", "", "Supprimer");

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
  }

  addArticle(commande: Commande){
    for(let c of this.commandes) {
      if(c.id == commande.id){
        c.articles.push(new Article());
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
    if(article.statusArticle == 2 || article.statusArticle == 3){
      isDisabled = true;
    }
    return isDisabled;
  }

  compareColis(o1: Object, o2: Object): boolean {
      return o1 && o2 ? o1['idColis'] === o2['idColis'] : o1 === o2;
  }
}
