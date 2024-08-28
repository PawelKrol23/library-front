import { Component, OnInit } from '@angular/core';
import { Book } from './book.model';
import { BookClient } from './book.client';
import { Router, RouterLink } from '@angular/router';
import { BookFilterFormComponent, BookFilters } from "./book-filter-form/book-filter-form.component";
import { PageDetails } from '../shared/Page.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
  imports: [RouterLink, BookFilterFormComponent, NgxPaginationModule]
})
export class BookListComponent implements OnInit {
  filters: BookFilters = {};
  books: Book[] = [];
  page: PageDetails | null = null;
  dynamicDownload = document.createElement('a');

  constructor(private bookClient: BookClient, private router: Router) { }

  ngOnInit(): void {
    this.getBooksPage(this.filters, 1);
  }

  onDeleteClick(bookId: number) {
    this.bookClient.deleteBook(bookId).subscribe(response => {
      this.getBooksPage(this.filters, this.page?.number!);
    });
  }

  onEditClick(bookId: number) {
    this.router.navigate(['/books', bookId, 'edit']);
  }

  onExportToCsvClick() {
    this.bookClient.getBooksInCsv(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'books.csv';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  onImportFromCsvClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if (!fileList || fileList.length === 0) {
      return;
    }
    this.bookClient.uploadBooksInCsv(fileList[0]).subscribe(responseData => {
      this.getBooksPage(this.filters, this.page?.number!);
    });
  }

  onImportFromExcelClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if (!fileList || fileList.length === 0) {
      return;
    }
    this.bookClient.uploadBooksInExcel(fileList[0]).subscribe(responseData => {
      this.getBooksPage(this.filters, this.page?.number!);
    });
  }

  onExportToExcelClick() {
    this.bookClient.getBooksInExcel(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'books.xlsx';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  private getFilenameFromContentDisposition(contentDispositionHeaderValue: string) {
    // Regular expression to extract the filename value
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDispositionHeaderValue);

    if (matches && matches[1]) {
      return matches[1]
    } else {
      return '';
    }
  }

  onBooksFilter(booksFilters: BookFilters) {
    this.filters = booksFilters;
    this.getBooksPage(this.filters, 1);
  }

  private dynamicDownloadByHtmlTag(fileData: any, filename: string) {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    this.dynamicDownload.href = url;
    this.dynamicDownload.download = filename;

    const event = new MouseEvent("click");
    this.dynamicDownload.dispatchEvent(event);
  }

  private getBooksPage(bookFilters: BookFilters, page: number) {
    this.bookClient.getBooksPage(bookFilters, page-1).subscribe(responseData => {
      this.books = responseData.content;
      responseData.page.number++;
      this.page = responseData.page;
    });
  }

  onPageChange(newPageNumber: number) {
    this.getBooksPage(this.filters, newPageNumber);
  }
}
