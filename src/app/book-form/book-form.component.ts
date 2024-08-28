import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookClient } from '../book-list/book.client';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorClient } from '../author-list/author.client';
import { Author } from '../author-list/author.model';
import { Member } from '../member-list/member.model';
import { MemberClient } from '../member-list/member.client';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  bookId = -1;
  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    isbn: new FormControl('', [Validators.required]),
    borrowerId: new FormControl(''),
    authorId: new FormControl(''),
  });
  authors: Author[] = [];
  members: Member[] = [];

  constructor(
    private bookClient: BookClient, 
    private router: Router, 
    private route: ActivatedRoute, 
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

    this.route.paramMap.subscribe(paramMap => {
      const bookIdString = paramMap.get('id');
      if(!bookIdString) {
        this.bookId = -1;
        return;
      }
      const bookId = +bookIdString;
      if(!bookId) {
        this.bookId = -1;
        return;
      }

      this.bookClient.getBookById(bookId).subscribe(responseData => {
        this.bookId = responseData.id;
        this.bookForm.patchValue({
          title: responseData.title,
          isbn: responseData.isbn,
          borrowerId: responseData.borrowerId ? responseData.borrowerId.toString() : '',
          authorId: responseData.authorId ? responseData.authorId.toString() : '',
        });
      });
    });
  }

  onSubmit() {
    if(this.bookForm.invalid) {
      return;
    }
    const title = this.bookForm.value.title as unknown as string;
    const isbn = this.bookForm.value.isbn as unknown as string;
    const authorIdFormValue = this.bookForm.value.authorId;
    let authorId: number | null = null;
    if(authorIdFormValue) {
      authorId = +authorIdFormValue;
    }
    const borrowerIdFormValue = this.bookForm.value.borrowerId;
    let borrowerId: number | null = null;
    if(borrowerIdFormValue) {
      borrowerId = +borrowerIdFormValue;
    }

    const bookData = {
      title: title,
      isbn: isbn,
      authorId: authorId,
      borrowerId: borrowerId
    }

    if(this.bookId === -1) {
      this.bookClient.addNewBook(bookData).subscribe(response => {
        this.router.navigate(['/books']);
      });
    } else {
      this.bookClient.updateBook(this.bookId, bookData).subscribe(response => {
        this.router.navigate(['/books']);
      });
    }
  }
}
