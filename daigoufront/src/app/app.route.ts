import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {InscriptionComponent} from './inscription/inscription.component';
import {LoginComponent} from './login/login.component';
import {UserdashboardComponent} from './userdashboard/userdashboard.component';
import {AdmindashboardComponent} from './admindashboard/admindashboard.component';
import {CreationCommandeComponent} from './creation-commande/creation-commande.component';
import {AuthGuard} from './auth.guard';
import {CommandesComponent} from './commandes/commandes.component';
import { ArticlemodeleComponent } from './articlemodele/articlemodele.component';
import { StockageComponent } from './stockage/stockage.component';

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
    { path: '*', pathMatch: 'full', redirectTo: 'home'}
];