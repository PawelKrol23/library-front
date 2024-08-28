import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthorClient } from '../../author-list/author.client';
import { MemberClient } from '../../member-list/member.client';
import { Author } from '../../author-list/author.model';
import { Member } from '../../member-list/member.model';

export interface BookFilters {
  title?: string,
  isbn?: string,
  createdAtAfter?: string,
  createdAtBefore?: string,
  authorId?: number,
  borrowerId?: number,
  sort?: string,
}

@Component({
  selector: 'app-book-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-filter-form.component.html',
  styleUrl: './book-filter-form.component.css'
})
export class BookFilterFormComponent implements OnInit {
  @Output() filter = new EventEmitter<BookFilters>();

  authors: Author[] = [];
  members: Member[] = [];

  bookFilterForm = new FormGroup({
    title: new FormControl(''),
    isbn: new FormControl(''),
    createdAtAfter: new FormControl(''),
    createdAtBefore: new FormControl(''),
    authorId: new FormControl(''),
    borrowerId: new FormControl(''),
    sort: new FormControl(''),
  });

  readonly fieldsToSort = [
    'id',
    'title',
    'isbn',
    'createdAt',
    'lastModifiedAt',
    'borrowedBy.id',
    'author.id',
  ];

  constructor(    
    private authorClient: AuthorClient,
    private memberClient: MemberClient
  ) {}

  ngOnInit(): void {
    this.authorClient.getAllAuthors({}).subscribe(authors => {
      this.authors = authors;
    })

    this.memberClient.getAllMembers({}).subscribe(members => {
      this.members = members;
    })
  }

  onSubmit() {
    const filterObject: any = {};
    for(let formControlName in this.bookFilterForm.controls) {
      const value = this.bookFilterForm.get(formControlName)?.value;
      if(value) {
        filterObject[formControlName] = value;
      }
    }

    this.filter.emit(filterObject);
  }
}
