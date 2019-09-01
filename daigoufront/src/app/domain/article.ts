import { Colis } from './colis';
import { Commande } from './commande';

export class Article {
    idArticle: number;
    nameArticle: string;
    priceAchat: number;
    priceVente: number;
    count: number;
    countArticleAchete: number;
    countArticleFromStockageFrance: number;
    countArticleFromStockageChine: number;
    countArticleFromStockageEnRoute: number;
    countArticleAcheteDistribue: number;
    countArticleFromStockageChineDistribue: number;
    colis: Colis;
    commande: Commande;

    typeArticle: any;
    statusArticlePreparation: any;
    statusArticle: any;
    statusArticleAcheteDistribue: any;
    statusArticleStockageChineDistribue: any;

    dateCreation: Date;
    dateEnvoie: Date;
    dateArrive: Date;
    dateDistribution: Date;

    //dto
    countArticleFromStockageFranceSelectable: number[] = [];
    countArticleFromStockageChineSelectable: number[] = [];
    countArticleFromStockageEnRouteSelectable: number[] = [];

    countSelectedEnRouteToChine: number;

    constructor() {

    }
  }