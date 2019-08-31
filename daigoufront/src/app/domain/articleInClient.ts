import { Colis } from './colis';
import { Commande } from './commande';

export class ArticleInClient {
    idArticle: number;
    nameArticle: string;
    priceAchat: number;
    priceVente: number;
    count: number;
    statusArticlePrepartion: any;
    countArticleFromStockageFrance: number;
    countArticleFromStockageChine: number;
    countArticleFromStockageEnRoute: number;

    statusArticlePreparation: any;
    statusArticle: any;
    statusArticleDistribue: any;

    colis: Colis;
    commande: Commande;

    dateCreation: Date;
    dateEnvoie: Date;
    dateArrive: Date;
    dateDistribution: Date;

    constructor() {

    }
  }