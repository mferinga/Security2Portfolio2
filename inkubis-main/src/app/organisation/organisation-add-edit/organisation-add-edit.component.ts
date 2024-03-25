import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationService } from 'src/app/infrastructure/organisation.service';
import { IOrganisation } from '../organisation.model';

@Component({
  selector: 'app-organisation-add-edit',
  templateUrl: './organisation-add-edit.component.html',
  styleUrls: ['./organisation-add-edit.component.scss'],
})
export class OrganisationAddEditComponent implements OnInit {
  organisation: IOrganisation = {
    id: '',
    name: '',
    organisationImage: '',
    organisationIdentifier: '',
    address: '',
    zipcode: '',
    city: '',
    country: '',
    representative: '',
    usersCount: 0,
    contractCount: 0,
  };
  imageBase64: any;
  imgSrc: string | null = '';
  isEditing: boolean = false;

  organisationNameExists: boolean = false;

  constructor(
    private organisationService: OrganisationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.router
    this.activatedRoute.paramMap.subscribe((params) => {
      const orgId = params.get('id');
      if (orgId) {
        this.isEditing = true;
        this.organisationService.getOrganisationById(orgId).subscribe((org) => {
          this.organisation = org;
          this.imgSrc = this.organisation.organisationImage ? this.organisation.organisationImage : null;
          this.imageBase64 = this.organisation.organisationImage ? this.organisation.organisationImage : null;
        })
      }
    })
  }

  useImage(event: any) {
    let file = event.target.files[0];
    const reader = new FileReader();
    this.toBase64(reader, file).then((result) => {
      this.imageBase64 = result;
    });
  }
  toBase64 = (fileReader: FileReader, file: any) =>
    new Promise((resolve, reject) => {
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });

  onSubmit() {
    this.organisation.organisationImage = this.imageBase64;
    if (!(this.imageBase64 == '') && !(this.organisation.name == '')) {
      if (this.isEditing) {
        this.organisationService.editOrganisation(this.organisation).subscribe((result: any) => {

          if (result.error) {
            this.organisationNameExists = true;
            return;
          } else {
            this.router.navigate(['organisations/' + this.organisation.id])
          }
        })
      } else {
        this.organisationService
          .createOrganisation(this.organisation)
          .subscribe((result: any) => {
            if (result.error) {
              this.organisationNameExists = true;
              return;
            } else {
              this.router.navigate(['organisations']);
            }
          });
      }
    }
  }
}
