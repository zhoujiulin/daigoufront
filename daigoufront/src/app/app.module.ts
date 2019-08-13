import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

import { UserService } from './user.service';
import { LoginAuthService } from './login-auth.service';
import { CommandesComponent } from './components/commandes/commandes.component';
import { CommandeService } from './services/commande.service';
import { CreationCommandeComponent } from './components/creation-commande/creation-commande.component';
import { IntOnlyDirective } from './common/intonly-directive';
import { NumberOnlyDirective } from './common/numberonly-directive';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, NgbdModalContent } from './common/modal/modal/modal.component';
import { ArticlemodeleComponent } from './components/articlemodele/articlemodele.component';
import { StockageComponent } from './components/stockage/stockage.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { ColisComponent } from './components/colis/colis.component';

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
    NgbdModalContent,
    ArticlemodeleComponent,
    StockageComponent,
    ColisComponent
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
    })
  ],
  providers: [
    UserService,
    AuthGuard,
    LoginAuthService,
    CommandeService,
    NgbActiveModal,
    ModalComponent,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent],
})
export class AppModule { }
