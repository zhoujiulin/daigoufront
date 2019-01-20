import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { ROUTES } from './app.route';
import { AuthGuard } from './auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { InscriptionComponent } from './inscription/inscription.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { HomeComponent } from './home/home.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';

import { UserService } from './user.service';
import { LoginAuthService } from './login-auth.service';
import { CommandesComponent } from './commandes/commandes.component';
import { CommandeService } from './services/commande.service';
import { CreationCommandeComponent } from './creation-commande/creation-commande.component';
import { IntOnlyDirective } from './common/intonly-directive';
import { NumberOnlyDirective } from './common/numberonly-directive';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, NgbdModalContent } from './common/modal/modal/modal.component';
import { ArticlemodeleComponent } from './articlemodele/articlemodele.component';
import { StockageComponent } from './stockage/stockage.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
    StockageComponent
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
