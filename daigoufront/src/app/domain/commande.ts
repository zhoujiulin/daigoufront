import { Client } from './client';
import { Article } from './article';

export class Commande {
    id: number;
    status: any;
    typeCommande: any;
    client: Client;
    articles: Array<Article>;

    constructor() {

    }
}