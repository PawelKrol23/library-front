import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface MemberFilters {
  firstName?: string,
  lastName?: string,
  email?: string,
  createdAtAfter?: string,
  createdAtBefore?: string,
}

@Component({
  selector: 'app-member-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './member-filter-form.component.html',
  styleUrl: './member-filter-form.component.css'
})
export class MemberFilterFormComponent {
  @Output() filter = new EventEmitter<MemberFilters>();

  memberFilterForm = new FormGroup({
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
    'email',
    'createdAt',
    'lastModifiedAt'
  ];

  onSubmit() {
    const filterObject: any = {};
    for(let formControlName in this.memberFilterForm.controls) {
      const value = this.memberFilterForm.get(formControlName)?.value;
      if(value) {
        filterObject[formControlName] = value;
      }
    }

    this.filter.emit(filterObject);
  }
}
