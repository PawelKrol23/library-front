import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface AuthorFilters {
  firstName?: string,
  lastName?: string,
  createdAtAfter?: string,
  createdAtBefore?: string,
  sort?: string,
}

@Component({
  selector: 'app-author-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './author-filter-form.component.html',
  styleUrl: './author-filter-form.component.css'
})
export class AuthorFilterFormComponent {
  @Output() filter = new EventEmitter<AuthorFilters>();

  authorFilterForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    createdAtAfter: new FormControl(''),
    createdAtBefore: new FormControl(''),
    sort: new FormControl(''),
  });

  readonly fieldsToSort = [
    'id',
    'firstName',
    'lastName',
    'createdAt',
    'lastModifiedAt'
  ];

  onSubmit() {
    const filterObject: any = {};
    for(let formControlName in this.authorFilterForm.controls) {
      const value = this.authorFilterForm.get(formControlName)?.value;
      if(value) {
        filterObject[formControlName] = value;
      }
    }

    this.filter.emit(filterObject);
  }
}
