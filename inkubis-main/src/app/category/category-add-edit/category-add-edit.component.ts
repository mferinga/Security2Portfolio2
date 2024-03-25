import { Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from 'src/app/contract/step2/field.model';
import { CategoryService } from 'src/app/infrastructure/category.service';
import { IOrganisation } from 'src/app/organisation/organisation.model';

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: ['./category-add-edit.component.scss']
})
export class CategoryAddEditComponent implements OnInit {

  @Input() category!: ICategory;
  categoryExists = false;
  currentPriority: number = 0;
  allCategories: ICategory[] = [];
  sortedCategoryList: ICategory[] = [];
  @ViewChildren('cats') editingCat?: QueryList<HTMLDivElement>;
  categoryNameExists = false;
  errorMessage = '';

  constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.category = {
      name: '',
      priority: 0,
    } as ICategory;

    this.route.paramMap.subscribe((params) => {
      const categoryId = params.get('id');
      if (categoryId) {

        this.categoryService.getCategoryById(categoryId).subscribe((categoryData: ICategory) => {
          console.log('categoryData');
          console.log(categoryData);

          this.currentPriority = categoryData.priority!;
          this.category = categoryData;

          this.categoryExists = true;
          this.categoryService.getAllCategories().subscribe((allCats) => {
            this.allCategories = allCats;
            let index = this.allCategories.findIndex((c) => c.name == this.category.name);
            this.allCategories.splice(index, 1);
            console.log(this.category);

            this.allCategories.push(this.category);
          })
        })
      }
    })
  }
  ngAfterContentChecked() {
    console.log('AFterviewcheck');
    this.sortedCategoryList = this.allCategories.sort(function (a, b) { return a.priority! - b.priority! })
  }
  plusOnePriority() {
    this.category.priority! += 1;
    if (this.category.priority! > this.sortedCategoryList.length) {
      this.category.priority! = this.sortedCategoryList.length;
    }
  }
  minusOnePriority() {
    this.category.priority! -= 1;
    if (this.category.priority! < 0) {
      this.category.priority! = 0;
    }
  }
  ngAfterViewInit() {
    console.log('afterview');
    this.editingCat?.changes.subscribe((cats) => {
      cats._results.forEach((paragraph: any) => {
        console.log(paragraph.nativeElement.firstChild.innerHTML);
        if (paragraph.nativeElement.firstChild.innerHTML == this.category.name) {
          paragraph.nativeElement.firstChild.style.fontWeight = 'bold';
        }

      });

    });

  }


  onSubmit(): void {
    if (this.categoryExists) {
      let previousCat: ICategory;
      this.sortedCategoryList.forEach(c => {
        console.log(c.priority);
      });

      this.sortedCategoryList.forEach((cat) => {
        if (previousCat) {
          if (previousCat.priority! == cat.priority) {
            console.log("+1");

            cat.priority! += 1;
          }

        }
        previousCat = cat;
      });
      this.sortedCategoryList.forEach(c => {
        console.log(c.priority);
      });

      this.categoryService.updateCategory(this.category).subscribe((result: any) => {

        if (result.error) {
          this.categoryNameExists = true;
          this.errorMessage = result.error.message;
          return;
        } else {
          this.router.navigate(['/categories']);
        }
      });
      // this.categoryService.updateCategory(this.category).subscribe((result: string) => {
      //   console.log(result);
      //   this.router.navigate(['/categories']);
      // })
    } else {
      this.categoryService.addNewCategory(this.category).subscribe((result: string) => {
        console.log(result);
        this.router.navigate(['/categories']);
      })
    }
  }
}
