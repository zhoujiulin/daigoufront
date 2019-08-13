import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Colis } from '../domain/colis';
import { ArticleStockage } from '../domain/articlestockage';
import { Article } from '../domain/article';

@Injectable({
  providedIn: 'root'
})
export class ColisService {

  constructor(private http: HttpClient) {
    this.http = http;
  }

  creationColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/create", colis, {headers: headers});
  }

  getColisStatus(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/colis/getcolisstatus", {headers: headers});
  }

  getColisByStatus(status: any, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/colis/getcolisbystatus/" + status, {headers: headers});
  }

  envoyerColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/envoyercolis", colis, {headers: headers});
  }

  arriverColis(colis: Colis, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/colis/arrivercolis", colis, {headers: headers});
  }

  putArticleStockageInColis(newArticleStockage: ArticleStockage, countArticleStockage: number, idColis: number, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    let url = environment.baseUrl + "/colis/putarticlestockageincolis?idColis=" + idColis + "&countArticleStockage=" + countArticleStockage; 
    return this.http.post(url, newArticleStockage, {headers: headers});
  }

  deleteArticleFromColis(article: Article, token: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    let url = environment.baseUrl + "/colis/deletearticlefromcolis"; 
    return this.http.post(url, article, {headers: headers});
  }
}
