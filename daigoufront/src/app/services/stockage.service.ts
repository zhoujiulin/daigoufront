import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ArticleStockage } from '../domain/articlestockage';
import { Colis } from '../domain/colis';

@Injectable({
  providedIn: 'root'
})
export class StockageService {

  constructor(private http: HttpClient) { 
    this.http = http;
  }

  getAllStockage(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/stockage/all", {headers: headers});
  }

  getAllStockageSelectable(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/stockage/allstockageselectable", {headers: headers});
  }

  createArticleStockage(articleStockage: ArticleStockage, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/stockage/create", articleStockage, {headers: headers});
  }

  saveArticleStockage(articleStockage: ArticleStockage, token: any){
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/stockage/save", articleStockage, {headers: headers});
  }

  getArticleStockageById(id: any, token: any) {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/stockage/getarticlestockage/" + id, {headers: headers});
  }

  getArticleStockageByName(nameArticleStockage: string, token: any) {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(environment.baseUrl + "/stockage/getarticlestockagebyname/" + nameArticleStockage, {headers: headers});
  }
}
