import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../login-auth.service';
import { Router } from '@angular/router';
import { CommandeService } from '../services/commande.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Commande } from '../domain/commande';

@Component({
  selector: 'app-creation-commande',
  templateUrl: './creation-commande.component.html',
  styleUrls: ['./creation-commande.component.css']
})
export class CreationCommandeComponent implements OnInit {

  public creationCommandeFrom: FormGroup;
  public loginuser: any = {};
  public commande: Commande;

  constructor(private router: Router, private commandeService: CommandeService, private authService: LoginAuthService, private _FB: FormBuilder) { 
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));

    this.creationCommandeFrom = this._FB.group({
      client: this._FB.group({ 
        nameWechat: ['', Validators.required],
        nameLivraison: "",
        telephone: "",
        adresse: ""
      }),
      articles: this._FB.array([
        this.initArticleFields()
      ])
    });
  }

  ngOnInit() {
  }

  initArticleFields() : FormGroup
  {
    return this._FB.group({
      nameArticle : ['', Validators.required],
      priceAchat :[''],
      priceVente :[''],
      count :['', Validators.required],
      statusArticle :['1']
    });
  } 

  addArticle() {
    const articles = <FormArray>this.creationCommandeFrom.controls.articles;
    articles.push(this.initArticleFields());
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
}
