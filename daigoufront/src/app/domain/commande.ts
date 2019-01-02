import { Client } from './client';
import { Article } from './article';

export class Commande {
    id : number;
    status : number;
    client: Client;
    articles : Array<Article>;

    constructor() {

    }
}