import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "./book.model";
import { BookFilters } from "./book-filter-form/book-filter-form.component";
import { Page } from "../shared/Page.model";

export interface BookData {
    title: string,
    isbn: string,
    authorId: number | null,
    borrowerId: number | null,
}

@Injectable({ providedIn: "root" })
export class BookClient {
    readonly serverAddress = 'http://localhost:8080';

    constructor(private http: HttpClient) {
    }

    getBooksPage(booksFilters: BookFilters, page: number): Observable<Page<Book>> {
        return this.http.get<Page<Book>>(
            this.serverAddress + '/books',
            {
                params: {
                    ...booksFilters,
                    page: page
                }
            }
        );
    }

    getAllBooks(booksFilters: BookFilters): Observable<Book[]> {
        return this.http.get<Book[]>(
            this.serverAddress + '/books/all',
            {
                params: {
                    ...booksFilters
                }
            }
        );
    }

    getBooksInCsv(booksFilters: any) {
        return this.http.get(
            this.serverAddress + '/books/csv',
            {
                observe: 'response',
                responseType: "blob" as "json",
                params: booksFilters
            }
        );
    }

    getBooksInExcel(booksFilters: any) {
        return this.http.get(
            this.serverAddress + '/books/excel',
            {
                observe: 'response',
                responseType: "blob" as "json",
                params: booksFilters
            }
        );
    }

    uploadBooksInCsv(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/books/csv',
            formData
        );
    }

    uploadBooksInExcel(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            this.serverAddress + '/books/excel',
            formData
        );
    }

    getBookById(bookId: number) {
        return this.http.get<Book>(
            this.serverAddress + `/books/${bookId}`
        );
    }

    updateBook(bookId: number, bookData: BookData) {
        return this.http.put(
            this.serverAddress + `/books/${bookId}`,
            bookData
        )
    }

    deleteBook(bookId: number) {
        return this.http.delete(
            this.serverAddress + `/books/${bookId}`
        );
    }

    addNewBook(bookData: BookData) {
        return this.http.post(
            this.serverAddress + '/books',
            bookData
        )
    }
}