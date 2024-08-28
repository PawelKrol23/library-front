import { Component, OnInit } from '@angular/core';
import { Author } from './author.model';
import { AuthorClient } from './author.client';
import { AuthorFilters, AuthorFilterFormComponent } from './author-filter-form/author-filter-form.component';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageDetails } from '../shared/Page.model';

@Component({
    selector: 'app-author-list',
    standalone: true,
    templateUrl: './author-list.component.html',
    styleUrl: './author-list.component.css',
    imports: [RouterLink, AuthorFilterFormComponent, NgxPaginationModule]
})
export class AuthorListComponent implements OnInit {
  filters: AuthorFilters = {};
  authors: Author[] = [];
  page: PageDetails | null = null;
  dynamicDownload = document.createElement('a');

  constructor(
    private authorClient: AuthorClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAuthorsPage(this.filters, 1);
  }

  onDeleteClick(authorId: number) {
    this.authorClient.deleteAuthor(authorId).subscribe(response => {
      this.getAuthorsPage(this.filters, this.page?.number!);
    });
  }

  onEditClick(authorId: number) {
    this.router.navigate(['/authors', authorId, 'edit']);
  }

  onExportToCsvClick() {
    this.authorClient.getAuthorsInCsv(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'authors.csv';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  onExportToExcelClick() {
    this.authorClient.getAuthorsInExcel(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'authors.xlsx';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  onImportFromCsvClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if(!fileList || fileList.length === 0) {
      return;
    }
    this.authorClient.uploadAuthorsInCsv(fileList[0]).subscribe(responseData => {
      this.getAuthorsPage(this.filters, this.page?.number!);
    });
  }

  onImportFromExcelClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if(!fileList || fileList.length === 0) {
      return;
    }
    this.authorClient.uploadAuthorsInExcel(fileList[0]).subscribe(responseData => {
      this.getAuthorsPage(this.filters, this.page?.number!);
    });
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

  private dynamicDownloadByHtmlTag(fileData: any, filename: string) {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    this.dynamicDownload.href = url;
    this.dynamicDownload.download = filename;

    const event = new MouseEvent("click");
    this.dynamicDownload.dispatchEvent(event);
  }

  onAuthorsFilter(authorFilters: AuthorFilters) {
    this.filters = authorFilters;
    this.getAuthorsPage(this.filters, 1);
  }

  private getAuthorsPage(authorFilters: AuthorFilters, page: number) {
    this.authorClient.getAuthorsPage(authorFilters, page-1).subscribe(responseData => {
      this.authors = responseData.content;
      responseData.page.number++;
      this.page = responseData.page;
    });
  }

  onPageChange(newPageNumber: number) {
    this.getAuthorsPage(this.filters, newPageNumber);
  }
}
