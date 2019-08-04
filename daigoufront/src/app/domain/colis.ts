import { Article } from './article';

export class Colis {
    idColis : number;
    nameColis : String;
    commentaireColis : String;
    statusColis: number;
    dateEnvoyer: Date;
    dateArriver: Date;
    articles : Article[];

    constructor() {

    }
  }