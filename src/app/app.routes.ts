import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { MemberListComponent } from './member-list/member-list.component';
import { BookFormComponent } from './book-form/book-form.component';
import { AuthorFormComponent } from './author-form/author-form.component';
import { MemberFormComponent } from './member-form/member-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full'
    },
    {
        path: 'books',
        component: BookListComponent,
    },
    {
        path: 'books/add',
        component: BookFormComponent,
    },
    {
        path: 'books/:id/edit',
        component: BookFormComponent,
    },
    {
        path: 'authors',
        component: AuthorListComponent,
    },
    {
        path: 'authors/add',
        component: AuthorFormComponent,
    },
    {
        path: 'authors/:id/edit',
        component: AuthorFormComponent,
    },
    {
        path: 'members',
        component: MemberListComponent,
    },
    {
        path: 'members/add',
        component: MemberFormComponent,
    },
    {
        path: 'members/:id/edit',
        component: MemberFormComponent,
    },
];
