import { Component, Input, OnInit, Injectable, Output, EventEmitter, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Colis } from 'src/app/domain/colis';
import { ArticleService } from 'src/app/services/article.service';
import { ArticleMapEnRoute } from 'src/app/domain/articleMapEnRoute';
import { ArticleMapEnRoutes } from 'src/app/domain/articleMapEnRoutes';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="col">
        <span>{{'message.confirmArrive' | translate}}</span>
      </div>
      <div class="col">
        <div *ngFor="let articleMapEnRoute of articleMapEnRoutes.articleMapEnRoutes">
          <hr/>
          <div class="margin-top-15">
            <div class="col">
              <div class="row">
                <div *ngFor="let articleColis of colis.articles">
                  <span *ngIf="articleColis.idArticle == articleMapEnRoute.idArticle">
                    {{'common.arrive' | translate}}: 
                    <strong class="font-size-18">
                      {{articleColis.nameArticle}} * {{articleColis.count}}
                    </strong>
                  </span>
                </div>
              </div>
              <div *ngFor="let article of articleMapEnRoute.articles">
                <div class="row margin-top-10">
                  <div class="col horizontal-center">
                    <strong>
                      <span class="font-size-18">
                        {{article.commande.client.nameWechat}}
                      </span>
                      * {{article.countArticleFromStockageEnRoute}}
                    </strong>
                  </div>
                  <div class="col-2">
                    <select class="form-control width-auto" [(ngModel)]="article.countSelectedEnRouteToChine">
                      <option value=0>0</option>
                      <option *ngFor="let i of article.countArticleFromStockageChineSelectable" value={{i}}>{{i}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">{{btnCancel}}</button>
      <button type="button" class="btn btn-danger" [disabled]="!enableBtnOk()" (click)="passBack()">{{btnText}}</button>
    </div>
  `
})
@Injectable()
export class NgbdModalArriverColisContent {
  @Input() title;
  @Input() message;
  @Input() btnText;
  @Input() btnCancel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public loginuser: any = {};
  public colis: Colis;
  public articleMapEnRoutes = new ArticleMapEnRoutes();
  
  constructor(public articleService: ArticleService, public activeModal: NgbActiveModal, colis: Colis) {
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.colis = colis;
  }

  ngOnInit() {
    this.articleMapEnRoutes.colis = this.colis;
    this.articleMapEnRoutes.articleMapEnRoutes = [];
    this.computeArticleStockageFromColisArriver();
  }

  passBack() {
    this.passEntry.emit(this.articleMapEnRoutes);
    this.activeModal.close('Close click');
  }

  enableBtnOk(){
    let isEnabled = true;
    for(let articleMapEnRoute of this.articleMapEnRoutes.articleMapEnRoutes){

      let countSelected = 0;
      let countTotal = 0;
      for(let article of articleMapEnRoute.articles){
        countSelected = Number(countSelected) + Number(article.countSelectedEnRouteToChine);
        countTotal = countTotal + article.countArticleFromStockageChineSelectable.length;
      }

      for(let articleColis of this.colis.articles){
        if(articleColis.idArticle == articleMapEnRoute.idArticle){
          if(articleColis.count > countTotal){
            if(countTotal != countSelected){
              isEnabled = false;
            }
          }else{
            if(articleColis.count != countSelected){
              isEnabled = false;
            }
          }
        }
      }
    }

    return isEnabled;
  }

  initSelect(){
    for(let articleMapEnRoute of this.articleMapEnRoutes.articleMapEnRoutes){

      for(let article of articleMapEnRoute.articles){
        article.countSelectedEnRouteToChine = 0;
        article.countArticleFromStockageChineSelectable = [];

        let length;
        for(let article of this.colis.articles){
          if(article.idArticle == articleMapEnRoute.idArticle){
            length = article.count;
          }
        }

        if(article.countArticleFromStockageEnRoute < length){
          length = article.countArticleFromStockageEnRoute;
        }

        for(let i=1; i<=length; i++){
          article.countArticleFromStockageChineSelectable.push(i);
        }
      }
    }
  }

  computeArticleStockageFromColisArriver(){
    this.articleService.computeArticleStockageFromColisArriver(this.colis, this.loginuser.token).subscribe(result =>{

      for(let key of Object.keys(result)){
        let amr = new ArticleMapEnRoute();
        amr.idArticle = Number(key);
        amr.articles = result[key];

        this.articleMapEnRoutes.articleMapEnRoutes.push(amr);
      }

      this.initSelect();
    });
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modalarrivercolis.component.html',
  styleUrls: ['./modalarrivercolis.component.css']
})

@Injectable()
export class ModalArriverColisComponent implements OnInit {
  constructor(private modalService: NgbModal, public translateService: TranslateService) { }

  ngOnInit() {

  }

  openModal(title: string, message: string, btnText: string, colis: Colis) {
    const injector = Injector.create({providers: [{provide: Colis, useValue: colis }]});

    const modalRef = this.modalService.open(NgbdModalArriverColisContent, {injector: injector});
    modalRef.componentInstance.title = this.translateService.instant(title);
    modalRef.componentInstance.message = this.translateService.instant(message);
    modalRef.componentInstance.btnText = this.translateService.instant(btnText);
    modalRef.componentInstance.btnCancel = this.translateService.instant("common.cancel");
    modalRef.componentInstance.colis = colis;

    return modalRef;
  }
}
