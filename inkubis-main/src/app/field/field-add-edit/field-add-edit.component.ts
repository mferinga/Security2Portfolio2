import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory, IField } from 'src/app/contract/step2/field.model';
import { CategoryService } from 'src/app/infrastructure/category.service';
import { FieldService } from 'src/app/infrastructure/field.service';

@Component({
  selector: 'app-field-add-edit',
  templateUrl: './field-add-edit.component.html',
  styleUrls: ['./field-add-edit.component.scss']
})
export class FieldAddEditComponent implements OnInit {
  field!: IField;
  categories: ICategory[] = [];
  fieldExists = false;
  fieldNameAlreadyExists = false;

  constructor(private fieldService: FieldService, private router: Router, private route: ActivatedRoute, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.field = {
      name: '',
      shortcodeName: '',
      category: {} as ICategory,
      isSpecifiable: false,
    } as IField;

    this.categoryService.getAllCategories().subscribe((categories: ICategory[]) => {
      this.categories = categories;
    });

    this.route.paramMap.subscribe((params) => {
      const fieldId = params.get('id');
      if (fieldId) {
        this.fieldService.getFieldAndCategoryById(fieldId).subscribe((fieldData: IField) => {
          this.field = fieldData;
          this.fieldExists = true;
        })
      }
    })
  }

  onSubmit(): void {
    if (this.fieldExists) {
      this.fieldService.updateField(this.field).subscribe((result: any) => {
        if(result.error) {
          this.fieldNameAlreadyExists = true;
        } else {
          this.router.navigate(['/fields']);
        }
      });
    } else {
      this.fieldService.addNewField(this.field).subscribe((result: any) => {
        if(result.error) {
          this.fieldNameAlreadyExists = true;
        } else {
          this.router.navigate(['/fields']);
        }
      });
    }
  }
}
