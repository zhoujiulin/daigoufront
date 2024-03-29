import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './common/module/material.module';

import { RouterModule } from '@angular/router';
import { ROUTES } from './app.route';
import { AuthGuard } from './auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { InscriptionComponent } from './components/inscription/inscription.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';

import { CommandesComponent } from './components/commandes/commandes.component';
import { CreationCommandeComponent } from './components/creation-commande/creation-commande.component';
import { IntOnlyDirective } from './common/intonly-directive';
import { NumberOnlyDirective } from './common/numberonly-directive';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, NgbdModalContent } from './common/modal/modalcommon/modal.component';
import { ArticlemodeleComponent } from './components/articlemodele/articlemodele.component';
import { StockageComponent } from './components/stockage/stockage.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ColisComponent } from './components/colis/colis.component';
import { ClientComponent } from './components/client/client.component';
import { ModalArriverColisComponent, NgbdModalArriverColisContent } from './common/modal/modalarrivercolis/modalarrivercolis.component';

import { UserService } from './user.service';
import { LoginAuthService } from './login-auth.service';
import { CommandeService } from './services/commande.service';
import { ClientService } from './services/client.service';
import { ArticleService } from './services/article.service';

export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InscriptionComponent,
    UserdashboardComponent,
    HomeComponent,
    AdmindashboardComponent,
    CommandesComponent,
    CreationCommandeComponent,
    IntOnlyDirective,
    NumberOnlyDirective,
    ModalComponent,
    ModalArriverColisComponent,
    NgbdModalContent,
    NgbdModalArriverColisContent,
    ArticlemodeleComponent,
    StockageComponent,
    ColisComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateHttpLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    UserService,
    AuthGuard,
    LoginAuthService,
    CommandeService,
    ClientService,
    ArticleService,
    NgbActiveModal,
    ModalComponent,
    ModalArriverColisComponent,
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NgbdModalArriverColisContent],
})
export class AppModule { }
