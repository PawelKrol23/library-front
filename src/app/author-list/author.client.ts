import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Author } from "./author.model";
import { AuthorFilters } from "./author-filter-form/author-filter-form.component";
import { Page } from "../shared/Page.model";

export interface AuthorData {
    lastName: string,
    firstName: string,
}

@Injectable({ providedIn: "root" })
export class AuthorClient {
    readonly serverAddress = 'http://localhost:8080';

    constructor(private http: HttpClient) {
    }

    getAllAuthors(authorFilters: AuthorFilters): Observable<Author[]> {
        return this.http.get<Author[]>(
            this.serverAddress + '/authors/all',
            {
                params: {
                    ...authorFilters
                }
            }
        );
    }

    getAuthorsPage(authorFilters: AuthorFilters, page: number): Observable<Page<Author>> {
        return this.http.get<Page<Author>>(
            this.serverAddress + '/authors',
            {
                params: {
                    ...authorFilters,
                    page: page
                }
            }
        );
    }

    getAuthorsInCsv(authorFilters: any) {
        return this.http.get<string>(
            this.serverAddress + '/authors/csv',
            {
                observe: 'response',
                responseType: "text" as "json",
                params: authorFilters
            }
        );
    }

    uploadAuthorsInCsv(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/authors/csv',
            formData
        );
    }

    getAuthorsInExcel(authorsFilters: any) {
        return this.http.get(
            this.serverAddress + '/authors/excel',
            {
                observe: 'response',
                responseType: "blob" as "json",
                params: authorsFilters
            }
        );
    }

    uploadAuthorsInExcel(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/authors/excel',
            formData
        );
    }

    getAuthorById(authorId: number) {
        return this.http.get<Author>(
            this.serverAddress + `/authors/${authorId}`
        );
    }

    updateAuthor(authorId: number, authorData: AuthorData) {
        return this.http.put(
            this.serverAddress + `/authors/${authorId}`,
            authorData
        )
    }

    deleteAuthor(authorId: number) {
        return this.http.delete(
            this.serverAddress + `/authors/${authorId}`
        );
    }

    addNewAuthor(authorData: AuthorData) {
        return this.http.post(
            this.serverAddress + '/authors',
            authorData
        )
    }
}