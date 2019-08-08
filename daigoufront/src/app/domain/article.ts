import { Colis } from './colis';
import { Commande } from './commande';

export class Article {
    idArticle : number;
    nameArticle : String;
    priceAchat : number;
    priceVente : number;
    count : number;
    countArticleAchete : number;
    countArticleFromStockage : number;
    statusArticle : any;
    colis : Colis;
    commande : Commande;

    constructor() {

    }
  }