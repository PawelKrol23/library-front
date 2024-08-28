import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorClient } from '../author-list/author.client';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css'
})
export class AuthorFormComponent implements OnInit {
  authorId = -1;
  authorForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  constructor(
    private authorClient: AuthorClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const authorIdString = paramMap.get('id');
      if(!authorIdString) {
        this.authorId = -1;
        return;
      }
      const authorId = +authorIdString;
      if(!authorId) {
        this.authorId = -1;
        return;
      }

      this.authorClient.getAuthorById(authorId).subscribe(responseData => {
        this.authorId = responseData.id;
        this.authorForm.patchValue({
          firstName: responseData.firstName,
          lastName: responseData.lastName
        });
      });
    });
  }

  onSubmit() {
    if(this.authorForm.invalid) {
      return;
    }
    const firstName = this.authorForm.value.firstName as unknown as string;
    const lastName = this.authorForm.value.lastName as unknown as string;
    const authorData = {
      firstName: firstName,
      lastName: lastName,
    }

    if(this.authorId === -1) {
      this.authorClient.addNewAuthor(authorData).subscribe(response => {
        this.router.navigate(['/authors']);
      });
    } else {
      this.authorClient.updateAuthor(this.authorId, authorData).subscribe(response => {
        this.router.navigate(['/authors']);
      });
    }
  }
}
