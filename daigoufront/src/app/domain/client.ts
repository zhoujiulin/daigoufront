import { Commande } from './commande';
import { ArticleAcheteInClient } from './articleAcheteInClient';
import { ArticleFromStockageEnRouteInClient } from './articleFromStockageEnRouteInClient';
import { ArticleFromStockageChineInClient } from './articleFromStockageChineInClient';

export class Client {
    id: number;
    nameWechat: String;
    nameLivraison: String;
    telephone: String;
    adresse: String;
    commandes: Array<Commande>;
    
    articleAchetes: Array<ArticleAcheteInClient>;
    articleFromStockageEnRoute: Array<ArticleFromStockageEnRouteInClient>;
    articleFromStockageChine: Array<ArticleFromStockageChineInClient>;
    countArticleTotal: number;
    countArticlePrisTotal: number;
  }