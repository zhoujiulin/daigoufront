import { Colis } from './colis';
import { Commande } from './commande';

export class Article {
    idArticle : number;
    nameArticle : string;
    priceAchat : number;
    priceVente : number;
    count : number;
    countArticleAchete : number;
    countArticleFromStockageFrance : number;
    countArticleFromStockageChine : number;
    countArticleFromStockageEnRoute : number;
    statusArticle : any;
    colis : Colis;
    commande : Commande;
    typeArticle : any;
    countArticleFromStockageFranceSelectable : number[] = [];
    countArticleFromStockageChineSelectable : number[] = [];
    countArticleFromStockageEnRouteSelectable : number[] = [];

    constructor() {

    }
  }