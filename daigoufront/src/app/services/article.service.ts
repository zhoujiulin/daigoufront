import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Colis } from '../domain/colis';
import { ArticleAcheteInClient } from '../domain/articleAcheteInClient';

@Injectable()
export class ArticleService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  envoyerArticleAuClient(articleInClient: ArticleAcheteInClient, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/articles/envoyerarticleauclient", articleInClient, {headers: headers});
  }

  computeArticleStockageFromColisArriver(colis: Colis, token: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/articles/computearticlestockagefromcolisarriver", colis, {headers: headers});
  }
}
