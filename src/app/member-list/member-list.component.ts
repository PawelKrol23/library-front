import { Component, OnInit } from '@angular/core';
import { Member } from './member.model';
import { MemberClient } from './member.client';
import { MemberFilters, MemberFilterFormComponent } from './member-filter-form/member-filter-form.component';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageDetails } from '../shared/Page.model';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [RouterLink, MemberFilterFormComponent, NgxPaginationModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  filters: MemberFilters = {};
  members: Member[] = [];
  page: PageDetails | null = null;
  dynamicDownload = document.createElement('a');
  
  constructor(
    private memberClient: MemberClient,
    private router: Router
  ) {
  }
  
  onDeleteClick(memberId: number) {
    this.memberClient.deleteMember(memberId).subscribe(response => {
      this.getMembersPage(this.filters, this.page?.number!);
    });
  }
  
  onEditClick(memberId: number) {
    this.router.navigate(['/members', memberId, 'edit']);
  }
  
  ngOnInit(): void {
    this.getMembersPage({}, 1);
  }
  
  onExportToCsvClick() {
    this.memberClient.getMembersInCsv(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'members.csv';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  onExportToExcelClick() {
    this.memberClient.getMembersInExcel(this.filters).subscribe(responseData => {
      const contentDisposition = responseData.headers.get('Content-Disposition');
      const filename = contentDisposition ? this.getFilenameFromContentDisposition(contentDisposition) : 'authors.xlsx';
      this.dynamicDownloadByHtmlTag(responseData.body!, filename);
    })
  }

  onImportFromExcelClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if(!fileList || fileList.length === 0) {
      return;
    }
    this.memberClient.uploadMembersInExcel(fileList[0]).subscribe(responseData => {
      this.getMembersPage(this.filters, this.page?.number!);
    });
  }

  onMembersFilter(memberFilters: MemberFilters) {
    this.filters = memberFilters;
    this.getMembersPage(this.filters, 1);
  }
  
  onImportFromCsvClick(csvFileInput: HTMLInputElement) {
    const fileList = csvFileInput.files;
    if(!fileList || fileList.length === 0) {
      return;
    }
    this.memberClient.uploadMembersInCsv(fileList[0]).subscribe(responseData => {
      this.getMembersPage(this.filters, this.page?.number!);
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
  
  private getMembersPage(authorFilters: MemberFilters, page: number) {
    this.memberClient.getMembersPage(authorFilters, page-1).subscribe(responseData => {
      this.members = responseData.content;
      responseData.page.number++;
      this.page = responseData.page;
    });
  }

  onPageChange(newPageNumber: number) {
    this.getMembersPage(this.filters, newPageNumber);
  }
}
