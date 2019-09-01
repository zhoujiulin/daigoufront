import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { LoginAuthService } from 'src/app/login-auth.service';
import { Client } from 'src/app/domain/client';
import { Article } from 'src/app/domain/article';
import { ArticleAcheteInClient } from 'src/app/domain/articleAcheteInClient';
import { ArticleFromStockageEnRouteInClient } from 'src/app/domain/articleFromStockageEnRouteInClient';
import { ArticleFromStockageChineInClient } from 'src/app/domain/articleFromStockageChineInClient';
import { ModalComponent } from 'src/app/common/modal/modalcommon/modal.component';
import { ArticleService } from 'src/app/services/article.service';
import { EnumStatusArticle } from 'src/app/common/enum/enumstatusarticle';
import { EnumStatusArticleAcheteDistribue } from 'src/app/common/enum/enumstatusarticleachetedistribue';
import { EnumStatusArticleStockageChineDistribue } from 'src/app/common/enum/enumstatusarticlestockagechinedistribue';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  public loginuser: any = {};
  public clients: Array<Client>;
  public modal: any;

  constructor(private authService: LoginAuthService, private clientService: ClientService, private articleService: ArticleService, private modalComponent: ModalComponent) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.clientService.getClientHasCommandeEnCours(this.loginuser.token).subscribe(clients =>{
      this.clients = clients;
      this.initArticleMaps();
      console.log(this.clients);
    })
  }

  initArticleMaps(){
    for(let client of this.clients){
      this.initArrayArticle(client);
      for(let commande of client.commandes){
        for(let article of commande.articles){

          if(this.isArticleAcheteInClient(article)){
            let articleAcheteInClient = this.valoriserArticleAcheteInClientFromArticle(article);
            client.articleAchetes.push(articleAcheteInClient);
            client.countArticlePrisTotal = client.countArticlePrisTotal + articleAcheteInClient.countArticleAchete;
          }

          if(article.countArticleFromStockageEnRoute > 0){
            let articleFromStockageEnRouteInClient = this.valoriserArticleFromStockageEnRouteInClientFromArticle(article);
            client.articleFromStockageEnRoute.push(articleFromStockageEnRouteInClient);
            client.countArticlePrisTotal = client.countArticlePrisTotal + articleFromStockageEnRouteInClient.countArticleFromStockageEnRoute;
          }

          if(article.countArticleFromStockageChine > 0){
            let articleFromStockageChineInClient = this.valoriserArticleFromStockageChineInClientFromArticle(article);
            client.articleFromStockageChine.push(articleFromStockageChineInClient);
            client.countArticlePrisTotal = client.countArticlePrisTotal + articleFromStockageChineInClient.countArticleFromStockageChine;
          }
          client.countArticleTotal = client.countArticleTotal + article.count;
        }
      }
    }
  }

  isAllowedEnvoyerAuClient(articleInClient: any){
    if(articleInClient['countArticleAchete'] > 0 || articleInClient['countArticleFromStockage'] > 0){
      if(articleInClient.statusArticle.index == EnumStatusArticle.ARTICLE_ARRIVE_EN_CHINE_PRET_A_DISTRIBUER){
        if(articleInClient.statusArticleAcheteDistribue == null || articleInClient.statusArticleAcheteDistribue.index == EnumStatusArticleAcheteDistribue.ARTICLE_ACHETE_NON_DISTRIBUE ){
          return true;
        }
        return false;
      } 
    }

    if(articleInClient['countArticleFromStockageChine'] > 0){
      if(articleInClient.statusArticleStockageChineDistribue == null || articleInClient.statusArticleStockageChineDistribue.index == EnumStatusArticleStockageChineDistribue.ARTICLE_FROM_STOCKAG_CHINE_NON_DISTRIBUE){
        return true;
      }
    }

    return false;
  }

  envoyerArticleAuClient(articleInClient: any){
    const modalRef  = this.modal.openModal("common.warning", "message.article.confirmSendArticleToClient", "common.confirm");

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.articleService.envoyerArticleAuClient(articleInClient, this.loginuser.token).subscribe(article =>{
        articleInClient.statusArticleAcheteDistribue = article.statusArticleAcheteDistribue;
        articleInClient.statusArticleStockageChineDistribue = article.statusArticleStockageChineDistribue;
      })
    })
  }

  isArticleAcheteInClient(article: Article){
    if(article.countArticleAchete > 0 || article.countArticleFromStockageFrance > 0){
      return true;
    }

    let count = article.count - article.countArticleFromStockageEnRoute - article.countArticleFromStockageChine;
    if(count > 0){
      return true
    }
    return false;
  }

  valoriserArticleFromStockageEnRouteInClientFromArticle(article: Article){
    let articleFromStockageEnRouteInClient: ArticleFromStockageEnRouteInClient = this.valoriserArticleInClientFromArticle(article);

    articleFromStockageEnRouteInClient.countArticleFromStockageEnRoute = article.countArticleFromStockageEnRoute;
    return articleFromStockageEnRouteInClient;
  }

  valoriserArticleFromStockageChineInClientFromArticle(article: Article){
    let articleFromStockageChineInClient: ArticleFromStockageChineInClient = this.valoriserArticleInClientFromArticle(article);
    articleFromStockageChineInClient.countArticleFromStockageChine = article.countArticleFromStockageChine;
    articleFromStockageChineInClient.countArticleFromStockageChineDistribue = article.countArticleFromStockageChineDistribue;

    return articleFromStockageChineInClient;
  }

  valoriserArticleAcheteInClientFromArticle(article: Article){
    let articleStockageInClient: ArticleAcheteInClient = this.valoriserArticleInClientFromArticle(article);

    articleStockageInClient.countArticleAchete = article.countArticleAchete + article.countArticleFromStockageFrance;
    articleStockageInClient.countArticleFromStockage = article.countArticleFromStockageEnRoute + article.countArticleFromStockageChine;
    articleStockageInClient.countArticleAcheteDistribue = article.countArticleAcheteDistribue;

    return articleStockageInClient;
  }

  valoriserArticleInClientFromArticle(article: Article){
    let articleInClient: any = {};
    articleInClient.idArticle = article.idArticle;
    articleInClient.nameArticle = article.nameArticle;
    articleInClient.count = article.count;
    articleInClient.countArticleFromStockageEnRoute = article.countArticleFromStockageEnRoute;
    articleInClient.countArticleFromStockageChine = article.countArticleFromStockageChine;

    articleInClient.typeArticle = article.typeArticle;
    articleInClient.statusArticlePreparation = article.statusArticlePreparation;
    articleInClient.statusArticle = article.statusArticle;
    articleInClient.statusArticleAcheteDistribue = article.statusArticleAcheteDistribue;
    articleInClient.statusArticleStockageChineDistribue = article.statusArticleStockageChineDistribue;

    //articleInClient.commande = article.commande;
    articleInClient.colis = article.colis;
    
    return articleInClient;
  }

  initArrayArticle(client: Client){
    client.countArticleTotal = 0;
    client.countArticlePrisTotal = 0;
    if(client.articleAchetes == null){
      client.articleAchetes = [];
    }
    if(client.articleFromStockageEnRoute == null){
      client.articleFromStockageEnRoute = [];
    }
    if(client.articleFromStockageChine == null){
      client.articleFromStockageChine = [];
    }
  }
}
