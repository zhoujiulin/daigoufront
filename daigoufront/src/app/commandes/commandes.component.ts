import { Component, OnInit, Injectable } from '@angular/core';
import { LoginAuthService } from '../login-auth.service';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../domain/commande';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../common/modal/modal/modal.component';
import { Article } from '../domain/article';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})

export class CommandesComponent implements OnInit {

  public loginuser: any = {};
  public statusList = new Map<number, string>();
  public statusGroupList = new Map<number[], string>();
  public articleStatusList: any;
  public commandes: any;
  public modal: any;

  constructor(private authService: LoginAuthService, private commandeService: CommandeService, private modalService: NgbModal, private modalComponent: ModalComponent) {
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
  }

  getCommandesByStatus(status: any) {
    this.commandeService.getCommandesByStatus(this.loginuser.token, status).subscribe(commandes =>{
      this.commandes = commandes;
    })
  }

  updateCommande(commande: Commande) {
    this.commandeService.updateCommande(this.loginuser.token, commande).subscribe(commande =>{
      
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
}
