import { Component, OnInit, ViewChild } from '@angular/core';
import { Colis } from '../domain/colis';
import { LoginAuthService } from '../login-auth.service';
import { ColisService } from '../services/colis.service';
import { NgSelectOption } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../common/modal/modal/modal.component';
import { EnumStatusCommande } from '../enum/enumstatuscommande';
import { EnumStatusColis } from '../enum/enumstatuscolis';
import { Article } from '../domain/article';

@Component({
  selector: 'app-colis',
  templateUrl: './colis.component.html',
  styleUrls: ['./colis.component.css']
})
export class ColisComponent implements OnInit {
  public loginuser: any = {};
  public newColis: Colis = new Colis();
  public statusList: any;
  public colisList: any;
  public statusColisSelect: any;
  public modal: any;

  constructor(private authService: LoginAuthService, private colisService: ColisService, private modalService: NgbModal, private modalComponent: ModalComponent) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser'));
    this.modal = modalComponent;
  }

  ngOnInit() {
    this.colisService.getColisStatus(this.loginuser.token).subscribe(statusList =>{
      this.statusList = statusList;
      console.log(statusList);
    })

    this.getColisByStatus(1);
    this.statusColisSelect = 1;
  }
  
  creationColis(colis: Colis){
    this.colisService.creationColis(colis, this.loginuser.token).subscribe(colis =>{
      this.newColis = new Colis();

      this.getColisByStatus(1);
      this.statusColisSelect = 1;
    })
  }

  getColisByStatus(status: any){
    this.colisService.getColisByStatus(status, this.loginuser.token).subscribe(colisList =>{
      console.log(colisList);
      this.colisList = colisList;
    })
  }

  envoyerColis(colis: Colis){
    const modalRef  = this.modal.openModal("Avertissement", "", "Confirmer");
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.colisService.envoyerColis(colis, this.loginuser.token).subscribe(colis =>{
        for(let c of this.colisList) {
          this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
        }
      })
    })
  }

  arriverColis(colis: Colis){
    const modalRef  = this.modal.openModal("Avertissement", "", "Confirmer");
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.colisService.arriverColis(colis, this.loginuser.token).subscribe(colis =>{
        for(let c of this.colisList) {
          this.colisList = this.colisList.filter(c => c.idColis !== colis.idColis);
        }
      })
    })
  }

  showBtnEnvoyer(colis: Colis){
    let isShow: boolean = false;
    if(colis.articles.length > 0 && colis.statusColis.index == EnumStatusColis.COLIS_NON_ENVOYE){
      isShow = true;
    }
    return isShow;
  }
}
