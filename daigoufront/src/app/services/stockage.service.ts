import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ArticleStockage } from '../domain/articlestockage';

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

  createArticleStockage(articleStockage: ArticleStockage, token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.baseUrl + "/stockage/create", articleStockage, {headers: headers});
  }
}
