import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {InscriptionComponent} from './components/inscription/inscription.component';
import {LoginComponent} from './components/login/login.component';
import {UserdashboardComponent} from './components/userdashboard/userdashboard.component';
import {AdmindashboardComponent} from './components/admindashboard/admindashboard.component';
import {CreationCommandeComponent} from './components/creation-commande/creation-commande.component';
import {AuthGuard} from './auth.guard';
import {CommandesComponent} from './components/commandes/commandes.component';
import { ArticlemodeleComponent } from './components/articlemodele/articlemodele.component';
import { StockageComponent } from './components/stockage/stockage.component';
import { ColisComponent } from './components/colis/colis.component';

export const ROUTES: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'inscription', component: InscriptionComponent},
    { path: 'login', component: LoginComponent},
    { path: 'admindashboard', component: AdmindashboardComponent, canActivate: [AuthGuard]},
    { path: 'userdashboard', component: UserdashboardComponent, canActivate: [AuthGuard]},
    { path: 'creationcommande', component: CreationCommandeComponent, canActivate: [AuthGuard]},
    { path: 'commandes', component: CommandesComponent, canActivate: [AuthGuard]},
    { path: 'articlemodele', component: ArticlemodeleComponent, canActivate: [AuthGuard]},
    { path: 'stockage', component: StockageComponent, canActivate: [AuthGuard]},
    { path: 'colis', component: ColisComponent, canActivate: [AuthGuard]},
    { path: '*', pathMatch: 'full', redirectTo: 'home'}
];