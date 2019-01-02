import { Component, Input, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Annuler</button>
      <button type="button" class="btn btn-danger" (click)="passBack()">{{btnText}}</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() title;
  @Input() message;
  @Input() btnText;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  
  constructor(public activeModal: NgbActiveModal) {}

  passBack() {
    this.passEntry.emit();
    this.activeModal.close('Close click');
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

@Injectable()
export class ModalComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  public content = NgbdModalContent;

  ngOnInit() {

  }

  openModal(title: string, message: string, btnText: string) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnText = btnText;

    return modalRef;
  }
}
