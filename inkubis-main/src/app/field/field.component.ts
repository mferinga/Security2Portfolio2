import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faPlus,
  faCheck,
  faTimes,
  faTrash,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IField } from '../contract/step2/field.model';
import { FieldService } from '../infrastructure/field.service';
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  faPlus = faPlus;
  faCheck = faCheck;
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;

  fieldsByCategory: any[] = [];
  @ViewChild(ConfirmationPromptComponent) confirmationPrompt: ConfirmationPromptComponent | undefined;

  constructor(private fieldService: FieldService) { }

  ngOnInit(): void {
    this.fieldService.getAllFields().subscribe((allFields: IField[]) => {
      this.splitFieldsInCategoryArrays(allFields);
    })
  }

  splitFieldsInCategoryArrays(allFields: IField[]) {
    let categories: any[] = [];
    allFields.sort((a,b) => {return a.category.priority - b.category.priority });
    allFields.forEach((field: IField) => {
      if (categories.length) {
        if (categories.find((c) => c.name == field.category.name)) {
        } else {
          categories.push({
            name: field.category.name,
            fields: [],
          });
        }
      } else {
        categories.push({
          name: field.category.name,
          fields: [],
        })
      }
    });

    allFields.forEach((field: IField) => {
      categories.forEach((category: any) => {
        if (category.name == field.category.name) {
          category.fields.push(field);
        }
      })
    })

    this.fieldsByCategory = categories;
  }

  deleteField = (id: string) => {
    this.fieldService.deleteField(id).subscribe((result) => {
      this.fieldsByCategory.forEach((category: any) => {
        category.fields = category.fields.filter((f: IField) => f.id !== id);
      })
    })
  }
}
