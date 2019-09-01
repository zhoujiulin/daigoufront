import { Colis } from './colis';
import { Commande } from './commande';

export class ArticleInClient {
    idArticle: number;
    nameArticle: string;
    priceAchat: number;
    priceVente: number;

    count: number;
    countArticleFromStockageFrance: number;
    countArticleFromStockageChine: number;
    countArticleFromStockageEnRoute: number;

    typeArticle: any;
    statusArticlePreparation: any;
    statusArticle: any;
    statusArticleAcheteDistribue: any;
    statusArticleStockageChineDistribue: any;

    colis: Colis;
    commande: Commande;

    dateCreation: Date;
    dateEnvoie: Date;
    dateArrive: Date;
    dateDistribution: Date;

    constructor() {

    }
  }