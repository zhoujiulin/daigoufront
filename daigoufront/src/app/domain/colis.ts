import { Article } from './article';

export class Colis {
    idColis : number;
    nameColis : String;
    commentaireColis : String;
    statusColis: any;
    dateEnvoyer: Date;
    dateArriver: Date;
    articles : Article[];
    countArticleInColis : number;

    constructor() {

    }
  }