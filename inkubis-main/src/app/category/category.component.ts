import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faPlus,
  faTrash,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ICategory, IField } from '../contract/step2/field.model';
import { CategoryService } from '../infrastructure/category.service';
import { FieldService } from '../infrastructure/field.service';
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild(ConfirmationPromptComponent) confirmationPrompt: ConfirmationPromptComponent | undefined;
  faPlus = faPlus;
  faTrash = faTrash;
  faPencilAlt = faPencilAlt;

  categories: ICategory[] = []
  fieldsByCategory: any[] = [];

  deletedFields: IField[] = [];

  constructor(private categoryService: CategoryService, private fieldService: FieldService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: ICategory[]) => {
      this.categories = categories;
      this.categories.sort(function (a, b) { return a.priority! - b.priority! })
    });
    this.fieldService.getAllFields().subscribe((result: IField[]) => {
      this.splitFieldsInCategoryArrays(result);
    });
  }

  splitFieldsInCategoryArrays(allFields: IField[]) {
    let categories: any[] = [];

    allFields.forEach((field: IField) => {
      if (categories.length) {
        if (categories.find((c) => c.name == field.category.name)) {
        } else {
          categories.push({
            name: field.category.name,
            id: field.category.id,
            fields: [],
          });
        }
      } else {
        categories.push({
          name: field.category.name,
          id: field.category.id,
          fields: [],
        })
      }
    });

    allFields.forEach((field: IField) => {
      categories.forEach((category: any) => {
        if (category.name == field.category.name) {
          category.fields.push(field);
        };
      })
    })

    this.fieldsByCategory = categories;
  }

  openDeleteModal(categoryId: string | undefined) {
    if (this.fieldsByCategory.filter((c: ICategory) => c.id == categoryId).length > 0) {
      this.deletedFields = this.fieldsByCategory.filter((c: ICategory) => c.id == categoryId)[0].fields;
    } else {
      this.deletedFields = [];
    }
    this.confirmationPrompt?.openModal(categoryId);
  }

  deleteCategory = (categoryId: string) => {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.categoryService.getAllCategories().subscribe((categories: ICategory[]) => {
        this.categories = categories;
      });
    });
  }

}
