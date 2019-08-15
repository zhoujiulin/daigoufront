import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LoginAuthService } from '../../login-auth.service';
import { Router } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Commande } from '../../domain/commande';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StockageService } from 'src/app/services/stockage.service';
import { ArticleStockage } from 'src/app/domain/articlestockage';
import { MatAutocompleteTrigger } from '@angular/material';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-creation-commande',
  templateUrl: './creation-commande.component.html',
  styleUrls: ['./creation-commande.component.css']
})
export class CreationCommandeComponent implements OnInit {
  filteredOptions: Observable<ArticleStockage[]>;

  public creationCommandeFrom: FormGroup;
  public loginuser: any = {};
  public commande: Commande;
  public typeCommandeList = new Map<number, string>();
  public isCommandePourClient = true;
  public articleStockageList: ArticleStockage[];

  constructor(private router: Router, private commandeService: CommandeService, private stockageService: StockageService, 
    private authService: LoginAuthService, private _FB: FormBuilder, @Inject(DOCUMENT) private _document: Document) {  

    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));

    this.creationCommandeFrom = this._FB.group({
      client: this._FB.group({ 
        nameWechat: [null, Validators.required],
        nameLivraison: null,
        telephone: null,
        adresse: null
      }),
      articles: this._FB.array([
        this.initArticleFields()
      ])
    });
  }

  ngOnInit() {
    this.getTypeCommande();
    this.getAllStockage();
  }

  initArticleFields() : FormGroup
  {
    return this._FB.group({
      nameArticle : ['', Validators.required],
      priceAchat :[''],
      priceVente :[''],
      count :['', Validators.required],
      statusArticle :['1'],
      typeArticle :['1']
    });
  } 

  addArticle() {
    const articles = <FormArray>this.creationCommandeFrom.controls.articles;
    articles.push(this.initArticleFields());

    this.initNameArticleFilter();
  }

  removeArticle(i: number) {
    const control = <FormArray>this.creationCommandeFrom.controls.articles;
    control.removeAt(i);
  }

  creationCommande(commande: any){
    this.commandeService.creationCommande(commande, this.loginuser.token).subscribe((response) => {
      if(response){
        this.router.navigate(['/commandes']);
      }
    })
  }

  getTypeCommande(){
    this.commandeService.getTypeCommande(this.loginuser.token).subscribe(typeCommandeList =>{
      this.typeCommandeList = typeCommandeList;
    })
  }

  changeTypeCommande(isCommandePourClient){
    this.isCommandePourClient = !isCommandePourClient;
    let nameWechatControl = this.creationCommandeFrom.get('client').get('nameWechat');
    if(!this.isCommandePourClient){
      nameWechatControl.clearValidators();
      nameWechatControl.updateValueAndValidity();
    }else{
      nameWechatControl.setValidators([Validators.required]);
      nameWechatControl.updateValueAndValidity();
    }
  }

  getAllStockage(){
    this.stockageService.getAllStockage(this.loginuser.token).subscribe((response) => {
      this.articleStockageList = response;

      let articlesFormArray = <FormArray>this.creationCommandeFrom.controls.articles;
      let nameArticleFormControl = <FormControl>articlesFormArray.controls[0].get("nameArticle");

      this.initNameArticleFilter();
    })
  }

  initNameArticleFilter(){
    let articlesFormArray = <FormArray>this.creationCommandeFrom.controls.articles;
    for(let control of articlesFormArray.controls){
      let nameArticleFormControl = control.get("nameArticle");

      this.filteredOptions = nameArticleFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.articleStockageList.slice())
      );
    }
  }
    
  displayFn(articleStockage?: ArticleStockage): string | undefined {
    return articleStockage ? articleStockage.nameArticleStockage: undefined;
  }

  private _filter(value: string): ArticleStockage[] {
    const filterValue = this._normalizeValue(value);
    return this.articleStockageList.filter(a => this._normalizeValue(a.nameArticleStockage).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
