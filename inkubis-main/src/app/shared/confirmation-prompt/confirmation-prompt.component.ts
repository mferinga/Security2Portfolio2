import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var window: any;

@Component({
  selector: 'app-confirmation-prompt',
  templateUrl: './confirmation-prompt.component.html',
  styleUrls: ['./confirmation-prompt.component.scss']
})
export class ConfirmationPromptComponent implements OnInit {
  modal: any;
  id: string | undefined;
  @Input() deleteFunction: ((args: any) => void) | undefined;
  @Input() optionalText: string | undefined;
  @Input() list: any[] | undefined;

  ngOnInit(): void {
    this.modal = new window.bootstrap.Modal(
      document.getElementById('deleteModal'),
    )
  }

  openModal(id: string | undefined) {
    this.modal.show();
    this.id = id;
  }

  delete() {
    this.modal.hide();
    this.deleteFunction?.(this.id);
    this.optionalText = undefined;
  }
}