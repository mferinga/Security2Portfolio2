import { Component, OnInit, Self, SkipSelf, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TemplateService } from '../infrastructure/template.service';
import { ITemplateVM } from './template.model';
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';

import {
  faPlus,
  faTrash,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  templates: ITemplateVM[] = [];
  faPlus = faPlus
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  @ViewChild(ConfirmationPromptComponent) confirmationPrompt: ConfirmationPromptComponent | undefined;

  constructor(private templateService: TemplateService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.templateService.getAllTemplates().subscribe((result) => {
      this.templates = result;

      this.templates.forEach(t => {
        let img = this.domSanitizer.bypassSecurityTrustUrl(t.templateImage);
        t.safeTemplateImage = img;
      })
    });
  }

  deleteTemplate = (id: string) => {
    this.templateService.deleteTemplate(id).subscribe((result) => {
      this.templates = this.templates.filter(t => t.id !== id);
    })
  }

}
